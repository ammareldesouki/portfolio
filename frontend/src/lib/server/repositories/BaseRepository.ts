import { Model, Document, SortOrder } from 'mongoose';

type Filter = Record<string, unknown>;

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: Filter): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async find(filter: Filter = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async findPaginated(
    filter: Filter = {},
    page: number,
    limit: number,
    sort: Record<string, SortOrder> = { createdAt: -1 }
  ): Promise<{ data: T[]; total: number }> {
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { data, total };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  async bulkWrite(operations: Record<string, unknown>[]) {
    return this.model.bulkWrite(operations as never[]);
  }

  async count(filter: Filter = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
