export default abstract class BaseController {
  checkField(field: string) {
    return field && field != "";
  }
}
