export default interface ICommand {
    name: string;
    usage: string;
    description: string;
    aliases: string[];
    run?(): void;
}