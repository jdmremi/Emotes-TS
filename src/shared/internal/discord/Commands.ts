import ICommand from "../../interfaces/ICommand";

export default class Commands {

    private commands: ICommand[] = [];

    public has(commandNameOrAlias: string): boolean {
        return this.commands.some((command) => command.cmdName.toLowerCase() === commandNameOrAlias.toLowerCase() || command.aliases.includes(commandNameOrAlias.toLowerCase()));
    }

    public get(commandNameOrAlias: string) {
        return this.commands.find((command) => command.cmdName.toLowerCase() === commandNameOrAlias.toLowerCase() || command.aliases.includes(commandNameOrAlias.toLowerCase()));
    }

    public add(command: ICommand): void {
        this.commands.push(command);
    }

    public toString(): string {
        return JSON.stringify(this.commands);
    }

    public getCommands(): ICommand[] {
        return this.commands;
    }

}