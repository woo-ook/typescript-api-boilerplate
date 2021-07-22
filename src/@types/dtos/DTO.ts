/* eslint-disable max-classes-per-file */
class DTOIterator<T> implements Iterator<T> {
  constructor(private dto: T[], private current = -1) {}

  next = (): IteratorResult<T> => {
    this.current += 1;
    return {
      done: this.current === this.dto.length,
      value: this.dto[this.current],
    };
  };
}

abstract class DTO implements Iterable<unknown> {
  protected propsList: unknown[] = [];
  public propsObj: Record<string, unknown> = {};

  [Symbol.iterator] = (): DTOIterator<unknown> => {
    return new DTOIterator(this.propsList);
  };

  setProps = (props: Record<string, unknown>): void => {
    this.propsList = Object.values(props);
    this.propsObj = props;
  };
}

export default DTO;
