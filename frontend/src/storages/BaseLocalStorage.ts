export default abstract class BaseLocalStorage<T> {
    abstract readonly key :string;

    abstract get(): T | null;
    abstract set(value: T): void;
    abstract delete(): void;
}
