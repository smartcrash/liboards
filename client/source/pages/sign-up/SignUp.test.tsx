import { render } from "../../utils/testUtils";
import { SignUp } from "./SignUp";

describe("<SignUp/>", () => {
  it("should render the form for the user to sign up", () => {
    const { getByAltText } = render(<SignUp />);
  });
});
