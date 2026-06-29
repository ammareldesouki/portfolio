import { ProjectRepository } from '../repositories/ProjectRepository';
import { IProject } from '../models/Project';
type FilterQuery = Record<string, unknown>;

const projectRepo = new ProjectRepository();

export class ProjectService {
  async list(query: { page?: number; limit?: number; status?: string; featured?: boolean; category?: string; sort?: string }) {
    const filter: FilterQuery = {};
    if (query.status) filter.status = query.status;
    if (query.featured !== undefined) filter.featured = query.featured;
    if (query.category) filter.category = query.category;

    const sortField = query.sort?.startsWith('-')
      ? { [query.sort.slice(1)]: -1 as const }
      : query.sort === 'sortOrder'
        ? { sortOrder: 1 as const }
        : { [query.sort || 'sortOrder']: 1 as const };

    return projectRepo.findPaginated(filter, query.page || 1, query.limit || 12, sortField);
  }

  async getBySlug(slug: string) {
    const project = await projectRepo.findBySlug(slug);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async getById(id: string) {
    const project = await projectRepo.findById(id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async create(data: Partial<IProject>) {
    return projectRepo.create(data as IProject);
  }

  async update(id: string, data: Partial<IProject>) {
    const project = await projectRepo.updateById(id, data);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async delete(id: string) {
    const project = await projectRepo.deleteById(id);
    if (!project) throw new Error('Project not found');
    return project;
  }

  async getFeatured() {
    return projectRepo.findFeatured();
  }

  async reorder(orders: { _id: string; sortOrder: number }[]) {
    const ops = orders.map(({ _id, sortOrder }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { sortOrder } },
      },
    }));
    await projectRepo.bulkWrite(ops);
  }
}
