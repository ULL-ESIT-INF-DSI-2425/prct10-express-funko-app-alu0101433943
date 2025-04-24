import { describe, test, expect } from "vitest";
import { findCharacter, myFilter } from "../src/clase/findCharacter";

describe("Asynchronous function findCharacter", () => {
  test("findCharacter should get correct information", () => {
    const filter: myFilter = { 
        name: "Goku"
    }
    return findCharacter(filter).then((data) => {
      expect(data.body.length).to.be.eql(1)
      expect(data.body[0].name).to.be.eql("Goku")
    });
  });

  test("findCharacter should get correct information", () => {
    const filter2: myFilter = { 
        name: "qwerty"
    }
    return findCharacter(filter2).catch((error) => {
      expect(error).to.be.eql("No resultado");
    });
  });
});
