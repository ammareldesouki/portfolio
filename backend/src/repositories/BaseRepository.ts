import { Model, Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    return this.model.find(filter, null, options);
  }

  async findPaginated(
    filter: FilterQuery<T> = {},
    page: number,
    limit: number,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
