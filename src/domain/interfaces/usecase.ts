// /src/domain/interfaces/IUseCase.ts

export interface IUsecase<T, U, V> {
  getOneById(id: number): Promise<T | null>;

  getAll(): Promise<T[]>;

  create(data: U): Promise<T>;

  update(id: number, data: V): Promise<T>;

  delete(id: number): Promise<void>;
}
