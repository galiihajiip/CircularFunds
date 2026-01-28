import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KreditorProfile } from './entities/investor-profile.entity';
import { UmkmFilterDto } from './dto/umkm-filter.dto';

@Injectable()
export class KreditorService {
  constructor(
    @InjectRepository(KreditorProfile)
    private kreditorRepository: Repository<KreditorProfile>,
  ) {}

  async findUmkms(filterDto: UmkmFilterDto) {
    // For now, return empty array since tables might not be fully set up
    // This prevents 500 errors
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
    };
  }

  async findUmkmById(id: string) {
    return this.kreditorRepository
      .createQueryBuilder('umkm')
      .leftJoinAndSelect('umkm.user', 'user')
      .leftJoin('scores', 'score', 'score.umkm_id = umkm.id')
      .leftJoin('submissions', 'submission', 'submission.umkm_id = umkm.id')
      .leftJoin('evidence_files', 'evidence', 'evidence.submission_id = submission.id')
      .where('umkm.id = :id', { id })
      .andWhere('umkm.is_published = :published', { published: true })
      .select([
        'umkm',
        'score',
        'submission',
        'evidence',
      ])
      .getOne();
  }

  async trackProfileView(umkmId: string, kreditorId?: string, sessionId?: string) {
    // Track view in profile_views table
    // Increment profile_views counter
    await this.kreditorRepository.query(
      'UPDATE umkm_profiles SET profile_views = profile_views + 1 WHERE id = $1',
      [umkmId]
    );

    // Insert view record
    if (kreditorId || sessionId) {
      await this.kreditorRepository.query(
        'INSERT INTO profile_views (umkm_id, investor_id, session_id, viewed_at) VALUES ($1, $2, $3, NOW())',
        [umkmId, kreditorId, sessionId]
      );
    }
  }

  async addBookmark(kreditorId: string, umkmId: string, notes?: string) {
    await this.kreditorRepository.query(
      'INSERT INTO bookmarks (investor_id, umkm_id, notes, created_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (investor_id, umkm_id) DO UPDATE SET notes = $3',
      [kreditorId, umkmId, notes]
    );

    // Increment bookmark count
    await this.kreditorRepository.query(
      'UPDATE umkm_profiles SET bookmark_count = bookmark_count + 1 WHERE id = $1',
      [umkmId]
    );
  }

  async removeBookmark(kreditorId: string, umkmId: string) {
    await this.kreditorRepository.query(
      'DELETE FROM bookmarks WHERE investor_id = $1 AND umkm_id = $2',
      [kreditorId, umkmId]
    );

    // Decrement bookmark count
    await this.kreditorRepository.query(
      'UPDATE umkm_profiles SET bookmark_count = GREATEST(bookmark_count - 1, 0) WHERE id = $1',
      [umkmId]
    );
  }

  async getBookmarks(kreditorId: string) {
    return this.kreditorRepository.query(
      `SELECT 
        u.*,
        b.notes,
        b.created_at as bookmarked_at,
        s.total_score,
        s.recommendation
      FROM bookmarks b
      JOIN umkm_profiles u ON b.umkm_id = u.id
      LEFT JOIN LATERAL (
        SELECT total_score, recommendation
        FROM scores
        WHERE umkm_id = u.id
        ORDER BY scored_at DESC
        LIMIT 1
      ) s ON true
      WHERE b.investor_id = $1
      ORDER BY b.created_at DESC`,
      [kreditorId]
    );
  }
}

