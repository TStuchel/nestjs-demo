export class ValidationError {
    constructor(
        private readonly message: string,
        private readonly property?: string,
        private readonly value?: string
    ) { }
}