type NiceMerge<
  Obj1,
  Obj2,
  MergedType = Obj1 & Obj2,
  Result = {
    [K in keyof MergedType]: MergedType[K];
  }
> = Result;

type ExtractValidatorData<T> = T extends Validator<infer U> ? U : never;

class Validator<T = {}> {
  static isNumber(arg: number) {
    return typeof arg === "number";
  }

  static isRequiredObjectType(
    obj: Record<string, any>,
    objToCompare: Record<string, any>
  ) {
    let isType = true;
    if (
      Object.keys(obj).length !==
      Object.keys(objToCompare.objectValidators).length
    ) {
      isType = false;
    }
    for (let key in obj) {
      if (!objToCompare.objectValidators[key](obj[key])) {
        isType = false;
      }
    }
    return isType;
  }

  objectValidators = {} as {
    [Key in keyof T]: (...args: any[]) => T[Key];
  };

  static isRequiredArrayType(
    arr: Record<string, any>[],
    objToCompare: Record<string, any>
  ) {
    let isArrType = true;
    for (let obj of arr) {
      if (!Validator.isRequiredObjectType(obj, objToCompare)) {
        isArrType = false;
      }
    }
    return isArrType;
  }

  addNumber<Name extends string, U extends boolean>(
    name: Name,
    config?: { isOptional?: U }
  ): Validator<
    NiceMerge<
      T,
      {
        [Key in Name]: U extends true ? null | undefined | number : number;
      }
    >
  > {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }
    // @ts-expect-error

    this.objectValidators[name] = (
      arg: U extends true ? number | undefined | null : number
    ) =>
      config?.isOptional
        ? Validator.isNumber(arg!) || arg === null || arg === undefined
        : Validator.isNumber(arg!);
    // @ts-expect-error
    return this;
  }

  addString<Name extends string, U extends boolean>(
    name: Name,
    config?: { isOptional?: U }
  ): Validator<
    NiceMerge<
      T,
      {
        [Key in Name]: U extends true ? null | undefined | string : string;
      }
    >
  > {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }
    // @ts-expect-error
    this.objectValidators[name] = (
      arg: U extends true ? string | undefined | null : string
    ) =>
      config?.isOptional
        ? typeof arg === "string" || arg === null || arg === undefined
        : typeof arg === "string";
    // @ts-expect-error
    return this;
  }

  addNumberArray<Name extends string>(
    name: Name
  ): Validator<NiceMerge<T, { [Key in Name]: number[] }>> {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }
    // @ts-expect-error
    this.objectValidators[name] = (arg: number[]) =>
      Array.isArray(arg) && arg.every((item) => Validator.isNumber(item));
    // @ts-expect-error
    return this;
  }

  addBoolean<Name extends string>(
    name: Name
  ): Validator<NiceMerge<T, { [Key in Name]: boolean }>> {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }
    // @ts-expect-error
    this.objectValidators[name] = (arg: boolean) => typeof arg === "boolean";
    // @ts-expect-error
    return this;
  }

  addObject<Name extends string, GetObjectData>(
    name: Name,
    getObj: GetObjectData
  ): Validator<
    NiceMerge<
      T,
      // @ts-expect-error
      { [Key in Name]: ExtractValidatorData<ReturnType<GetObjectData>> }
    >
  > {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }

    // @ts-expect-error
    this.objectValidators[name] = (arg: Record<string, any>) =>
      // @ts-expect-error
      Validator.isRequiredObjectType(arg, getObj());
    // @ts-expect-error
    return this;
  }

  addArrayOfObj<Name extends string, GetObjectData>(
    name: Name,
    getObj: GetObjectData
  ): Validator<
    NiceMerge<
      T,
      //@ts-expect-error
      { [Key in Name]: ExtractValidatorData<ReturnType<GetObjectData>>[] }
    >
  > {
    // @ts-expect-error
    if (this.objectValidators[name]) {
      throw new Error("this field is already defined");
    }

    // @ts-expect-error
    this.objectValidators[name] = (arg: Record<string, any>[]) =>
      //@ts-expect-error
      Validator.isRequiredArrayType(arg, getObj());
    // @ts-expect-error.

    return this;
  }

  validate(obj: T) {
    let isValid = true;
    for (let key in this.objectValidators) {
      if (!this.objectValidators[key](obj[key])) {
        isValid = false;
      }
    }

    return isValid;
  }
}

export { Validator };
