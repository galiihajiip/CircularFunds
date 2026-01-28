# CircularFund - Implementation Guide

## Phase 1: Project Setup (Week 1)

### Day 1-2: Initialize Projects

#### 1. Setup Frontend (Next.js)
```bash
# Create Next.js project
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir

cd frontend

# Install dependencies
npm install @tanstack/react-query zustand axios
npm install react-hook-form @hookform/resolvers zod
npm install recharts lucide-react
npm install next-auth
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge

# Install shadcn/ui
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add button input textarea select card badge avatar
npx shadcn-ui@latest add dialog sheet popover tooltip table tabs
npx shadcn-ui@latest add form toast progress skeleton dropdown-menu
```

#### 2. Setup Backend (NestJS)
```bash
# Already done! Just verify:
cd backend
npm install
npm run start:dev

# Should start on http://localhost:4000
```

#### 3. Setup AI Service (Python)
```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run
python main.py

# Should start on http://localhost:5000
```

#### 4. Setup Database
```bash
# Install PostgreSQL (if not installed)
# Download from: https://www.postgresql.org/download/

# Create database
createdb circularfund

# Or using psql:
psql -U postgres
CREATE DATABASE circularfund;
\q

# Run schema
psql -U postgres -d circularfund -f database/schema.sql

# Verify tables
psql -U postgres -d circularfund
\dt
```

### Day 3-4: Configure Environment

#### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-random-secret-here
NEXTAUTH_URL=http://localhost:3000
```

#### Backend `.env`
```bash
# Copy from .env.example
cp .env.example .env

# Edit with your values
DATABASE_URL=postgresql://postgres:password@localhost:5432/circularfund
JWT_SECRET=your-jwt-secret
AI_SERVICE_URL=http://localhost:5000
```

#### AI Service `.env`
```bash
cp .env.example .env
# Edit if needed
```

### Day 5: Setup AWS S3

```bash
# 1. Create AWS account
# 2. Create IAM user with S3 permissions
# 3. Create S3 bucket: circularfund-evidence
# 4. Enable CORS on bucket:
```

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": ["ETag"]
    }
]
```

```bash
# 5. Add credentials to backend .env
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=circularfund-evidence
```

---

## Phase 2: Authentication (Week 1-2)

### Backend: Auth Module

#### 1. Create Auth DTOs
```bash
cd backend/src/auth
```

Create `dto/register.dto.ts`:
```typescript
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(['UMKM', 'INVESTOR'])
  role: 'UMKM' | 'INVESTOR';
}
```

Create `dto/login.dto.ts`:
```typescript
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

#### 2. Create User Entity
Create `entities/user.entity.ts`:
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  role: 'UMKM' | 'INVESTOR';

  @Column({ default: false })
  email_verified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

#### 3. Implement Auth Service
Update `auth.service.ts`:
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = this.userRepository.create({
      email,
      password_hash,
      role,
    });
    
    await this.userRepository.save(user);
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate token
    const token = this.generateToken(user);
    
    return {
      user: { id: user.id, email: user.email, role: user.role },
      token,
    };
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
```

#### 4. Create Auth Controller
Update `auth.controller.ts`:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

#### 5. Update Auth Module
Update `auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

### Frontend: Auth Pages

#### 1. Create Auth Context
Create `frontend/lib/auth-context.tsx`:
```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: 'UMKM' | 'INVESTOR';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'UMKM' | 'INVESTOR') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user
      // TODO: Implement
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password,
    });
    
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    
    // Redirect based on role
    if (user.role === 'UMKM') {
      router.push('/dashboard');
    } else {
      router.push('/discover');
    }
  };

  const register = async (email: string, password: string, role: 'UMKM' | 'INVESTOR') => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      email,
      password,
      role,
    });
    
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    setUser(user);
    
    // Redirect to profile setup
    if (role === 'UMKM') {
      router.push('/profile/setup');
    } else {
      router.push('/profile/setup');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 2. Create Login Page
Create `frontend/app/(auth)/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Login ke CircularFund</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <p className="mt-4 text-center text-sm">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar
          </a>
        </p>
      </Card>
    </div>
  );
}
```

---

## Phase 3: UMKM Features (Week 2-4)

### Backend: UMKM Module

#### 1. Create UMKM Entities
```bash
cd backend/src/umkm
```

Create `entities/umkm-profile.entity.ts`, `entities/submission.entity.ts`, etc.

#### 2. Implement UMKM Service
Create CRUD operations for:
- Profile management
- Submission creation
- Evidence upload
- Dashboard stats

#### 3. Integrate with Scoring Service
When submission is created → Call scoring service → Save score

### Frontend: UMKM Pages

#### 1. Dashboard
- Display current score with gauge chart
- Show recent submissions
- Quick stats (views, bookmarks)

#### 2. Submission Form
- Multi-step wizard (8 indicators)
- File upload for each indicator
- Progress indicator
- Draft save functionality

#### 3. Score Page
- Detailed score breakdown
- Recommendations from AI
- History chart

---

## Phase 4: Investor Features (Week 5-6)

### Backend: Investor Module

#### 1. Discovery API
- Filtering by sector, location, score
- Pagination
- Sorting

#### 2. Bookmark System
- Add/remove bookmarks
- List bookmarked UMKMs

### Frontend: Investor Pages

#### 1. Discovery Page
- Filter panel (sidebar)
- UMKM cards grid
- Infinite scroll

#### 2. UMKM Detail Page
- Full profile display
- Score breakdown
- Evidence gallery
- Contact buttons

---

## Phase 5: Testing & Deployment (Week 7-8)

### Testing
```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test

# AI service tests
cd ai-service
pytest
```

### Deployment
```bash
# Deploy frontend to Vercel
cd frontend
vercel --prod

# Deploy backend to Railway
cd backend
# Push to GitHub, connect to Railway

# Deploy AI service to Railway
cd ai-service
# Push to GitHub, connect to Railway
```

---

## Quick Start Commands

### Development
```bash
# Terminal 1: Database
# Make sure PostgreSQL is running

# Terminal 2: Backend
cd backend
npm run start:dev

# Terminal 3: AI Service
cd ai-service
venv\Scripts\activate
python main.py

# Terminal 4: Frontend
cd frontend
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- AI Service: http://localhost:5000
- API Docs: http://localhost:4000/api

---

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_ctl status

# Restart PostgreSQL
pg_ctl restart

# Check connection
psql -U postgres -d circularfund
```

### Port Already in Use
```bash
# Windows: Kill process on port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

**Next Steps**: Follow each phase sequentially. Each phase builds on the previous one.
