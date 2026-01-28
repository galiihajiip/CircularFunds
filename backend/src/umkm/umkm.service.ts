import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UmkmProfile } from './entities/umkm-profile.entity';

@Injectable()
export class UmkmService {
  constructor(
    @InjectRepository(UmkmProfile)
    private umkmRepository: Repository<UmkmProfile>,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.umkmRepository.findOne({
      where: { user_id: userId },
    });

    // Return null if profile doesn't exist instead of throwing error
    return profile || null;
  }

  async createProfile(profileData: any) {
    const profile = this.umkmRepository.create(profileData);
    return this.umkmRepository.save(profile);
  }

  async updateProfile(id: string, profileData: any) {
    await this.umkmRepository.update(id, profileData);
    return this.umkmRepository.findOne({ where: { id } });
  }

  async getDashboard(userId: string) {
    const profile = await this.getProfile(userId);

    // If no profile, return basic structure
    if (!profile) {
      return {
        profile: null,
        currentScore: null,
        scoreHistory: [],
        recentSubmissions: [],
        stats: {
          profileViews: 0,
          bookmarkCount: 0,
          totalSubmissions: 0,
        },
      };
    }

    // Get latest score
    const latestScore = await this.umkmRepository.query(
      `SELECT * FROM scores WHERE umkm_id = $1 ORDER BY scored_at DESC LIMIT 1`,
      [profile.id]
    );

    // Get score history
    const scoreHistory = await this.umkmRepository.query(
      `SELECT total_score, scored_at FROM scores WHERE umkm_id = $1 ORDER BY scored_at ASC`,
      [profile.id]
    );

    // Get recent submissions
    const recentSubmissions = await this.umkmRepository.query(
      `SELECT * FROM submissions WHERE umkm_id = $1 ORDER BY submission_date DESC LIMIT 5`,
      [profile.id]
    );

    return {
      profile,
      currentScore: latestScore[0] || null,
      scoreHistory,
      recentSubmissions,
      stats: {
        profileViews: profile.profile_views,
        bookmarkCount: profile.bookmark_count,
        totalSubmissions: recentSubmissions.length,
      },
    };
  }
}
