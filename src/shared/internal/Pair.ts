export default class Pair<T, U> {
    private _first: T;
    private _second: U;
    constructor(first: T, second: U) {
        this._first = first;
        this._second = second;
    }

    get first(): T {
        return this._first;
    }

    get second(): U {
        return this._second;
    }

    set first(value: T) {
        this._first = value;
    }

    set second(value: U) {
        this._second = value;
    }

    equals(other: Pair<T, U>): boolean {
        return this._first === other._first && this._second === other._second;
    }

}