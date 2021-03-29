import { Validator } from "./index";

const validator1 = new Validator()
  .addNumber("a", { isOptional: false })
  .addString("b")
  .addArrayOfObj("d", () => validator2);

const validator2 = new Validator()
  .addNumber("x", { isOptional: true as const })
  .addString("y", { isOptional: true })
  .addObject("z", () => validator1)
  .addArrayOfObj("a", () => validator1);

const validator3 = new Validator().addNumber("a", { isOptional: true });
const validator4 = new Validator().addNumber("a", { isOptional: false });

const validObj1 = validator2.validate({
  x: null,
  y: "ahoj",
  z: { a: 3, b: "a", d: [] },
  a: [
    {
      a: 3,
      b: "b",
      d: [
        {
          x: 3,
          y: "a",
          z: { a: 3, b: "a", d: [] },
          a: [
            {
              a: 3,
              b: "a",
              d: [],
            },
          ],
        },
      ],
    },
  ],
});

const validObj2 = validator3.validate({
  a: null,
});

const validObj3 = validator3.validate({
  a: 3,
});

const validObj4 = validator3.validate({
  a: "a" as any,
});

const validObj5 = validator4.validate({ a: null as any });
const validObj6 = validator4.validate({ a: 3 });
const validObj7 = validator4.validate({ a: "a" as any });

test("isValid1", () => {
  expect(validObj1).toBe(true);
});
test("isValid2", () => {
  expect(validObj2).toBe(true);
});

test("isValid3", () => {
  expect(validObj3).toBe(true);
});

test("isValid4", () => {
  expect(validObj4).toBe(false);
});

test("isValid5", () => {
  expect(validObj5).toBe(false);
});

test("isValid6", () => {
  expect(validObj6).toBe(true);
});

test("isValid7", () => {
  expect(validObj7).toBe(false);
});
