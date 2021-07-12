import { IsValidUsername } from "../ValidateUserName";

describe("This is a simple test", () => {
    test("Check the username function", () => {
        expect(IsValidUsername("PeterLustig4353543")).toBe(true);
    });
});