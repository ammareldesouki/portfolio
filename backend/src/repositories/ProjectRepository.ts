import { BaseRepository } from './BaseRepository';
import { IProject, Project } from '../models/Project';
import { FilterQuery } from 'mongoose';

export class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(Project);
  }

  async findBySlug(slug: string): Promise<IProject | null> {
    return this.findOne({ slug } as FilterQuery<IProject>);
  }

  async findPublished(page: number, limit: number, filter: FilterQuery<IProject> = {}) {
    return this.findPaginated(
      { ...filter, status: 'published' } as FilterQuery<IProject>,
      page,
      limit,
      { createdAt: -1 }
    );
  }

  async findFeatured(): Promise<IProject[]> {
    return this.find({ featured: true, status: 'published' } as FilterQuery<IProject>, {
      sort: { createdAt: -1 },
      limit: 6,
    });
  }
}
