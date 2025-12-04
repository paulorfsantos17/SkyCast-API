export abstract class BaseEntity<Props> {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  protected props: Props;

  constructor(props: Props, id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id ?? crypto.randomUUID();
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.props = props;
  }

  getProps(): Props {
    return this.props;
  }

  // Atualiza props + updatedAt
  protected updateProps(newProps: Partial<Props>) {
    this.props = { ...this.props, ...newProps };
    this.updatedAt = new Date();
  }
}