export default abstract class BaseController {
  checkField(field: any) {
      if (field == undefined)
          return false;

      return !(typeof field == "string" && field == "");
  }
}
