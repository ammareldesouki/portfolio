import { Project, IProject } from '../models/Project';
import { BaseRepository } from './BaseRepository';

export class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(Project);
  }

  async findBySlug(slug: string) {
    return this.findOne({ slug: slug.toLowerCase() });
  }

  async findPublished() {
    return this.find({ status: 'published' }, { sortOrder: 1 });
  }

  async findFeatured() {
    return this.find({ status: 'published', featured: true }, { sortOrder: 1 });
  }
}
