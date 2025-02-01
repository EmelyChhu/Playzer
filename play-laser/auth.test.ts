import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth");

describe("Firebase Authentication", () => {
  test("should sign in a user with email and password", async () => {
    const auth = getAuth();
    const mockUser = { user: { uid: "123", email: "test@example.com" } };

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUser);

    const user = await signInWithEmailAndPassword(auth, "test@example.com", "password123");

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "test@example.com", "password123");
    expect(user).toEqual(mockUser);
  });

  test("should create a new user account", async () => {
    const auth = getAuth();
    const mockNewUser = { user: { uid: "456", email: "newuser@example.com" } };

    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockNewUser);

    const newUser = await createUserWithEmailAndPassword(auth, "newuser@example.com", "securepassword");

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, "newuser@example.com", "securepassword");
    expect(newUser).toEqual(mockNewUser);
  });

  test("should handle authentication errors", async () => {
    const auth = getAuth();
    const mockError = new Error("Invalid credentials");

    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(mockError);

    await expect(signInWithEmailAndPassword(auth, "wrong@example.com", "wrongpass")).rejects.toThrow("Invalid credentials");
  });
});
