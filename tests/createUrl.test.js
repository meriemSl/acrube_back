const Url = require("../models/url"); // Import the Mongoose model
const { createUrl } = require("../controllers/urlController"); // Import the function to test

jest.mock("../models/url"); // Mock Mongoose model

describe("createUrl function", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { urlInput: "https://example.com" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 409 if URL is already shortened", async () => {
    Url.findOne.mockResolvedValue({ originUrl: "https://example.com", hashUrl: "abc123" });

    await createUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "URL already shortened",
      url: { originUrl: "https://example.com", hashUrl: "abc123" },
    });
  });

  
  it("should return 201 and create a shortened URL", async () => {
    Url.findOne.mockResolvedValue(null); // Simulate that the URL does not exist

    const mockSave = jest.fn().mockResolvedValue({
      originUrl: "https://example.com",
      hashUrl: "xyz789",

    });

    Url.mockImplementation(function (data) {
      return {
        ...data, // Ensure the data is kept
        save: mockSave, // Attach the mocked save function
      };
    });

    await createUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      originUrl: "https://example.com",
      hashUrl: "xyz789",
      save: mockSave,
    }));

  });

  it("should return 400 on error", async () => {
    req.body = {}; // Missing URL

    await createUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error creating url shorten",
    });
  });
});
