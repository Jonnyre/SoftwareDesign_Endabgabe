import fs from "fs";
import path from "path";

export class FileHandler {
  private static _instance : FileHandler = new FileHandler();

  private constructor() {
    if(FileHandler._instance)
      throw new Error("Use FileHandler.getInstance() instead new FileHandler()")
    FileHandler._instance = this
  }

  public static GetInstance() : FileHandler {
    return FileHandler._instance;
  }

  private ReadFile(_pathToFile: string) : any {
    let jsonRaw = fs.readFileSync(path.resolve(__dirname, "../" + _pathToFile));
    let json : any = JSON.parse(jsonRaw.toString());
    return json;
  }

  public ReadArrayFile(_pathToFile: string) : Array<any> {
    return this.ReadFile(_pathToFile);
  }

  public ReadObjectFile(_pathToFile: string) : any {
    return this.ReadFile(_pathToFile);
  }

  public WriteFile(_pathToFile: string, _dataToWrite: any) : void {
    fs.writeFileSync(path.resolve(__dirname, "../" + _pathToFile), JSON.stringify(_dataToWrite));
  }
}

export default FileHandler.GetInstance();