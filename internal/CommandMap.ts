import ICommand from "../interfaces/ICommand";

export default class CommandMap {

    private commands: ICommand[] = [];

    has(commandNameOrAlias: string): boolean {
        return this.commands.some((command) => command.cmdName.toLowerCase() === commandNameOrAlias.toLowerCase() || command.aliases.includes(commandNameOrAlias.toLowerCase()));
    }

    get(commandNameOrAlias: string) {
        return this.commands.find((command) => command.cmdName.toLowerCase() === commandNameOrAlias.toLowerCase() || command.aliases.includes(commandNameOrAlias.toLowerCase()));
    }

    add(command: ICommand) {
        this.commands.push(command);
    }

    toString(): string {
        return JSON.stringify(this.commands);
    }

    getCommands(): ICommand[] {
        return this.commands;
    }

}