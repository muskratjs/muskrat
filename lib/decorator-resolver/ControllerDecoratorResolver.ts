export default class ControllerDecoratorResolver {
    public resolve(decorator: any) {
        return decorator.enum.shift();
    }
}
