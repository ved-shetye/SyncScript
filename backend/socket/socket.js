const Document = require("../models/Document");

const initializeSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.user);

    socket.on("join-document", async (documentId) => {
      try {
        const doc = await Document.findOne({
          _id: documentId,
          $or: [{ owner: socket.user }, { collaborators: socket.user }],
        });

        if (!doc) return socket.emit("error", "Document not found");

        socket.join(documentId);
        socket.emit("document-content", doc.content);
      } catch (err) {
        socket.emit("error", "Error loading document");
      }
    });

    socket.on("text-change", async ({ documentId, content }) => {
      try {
        const doc = await Document.findByIdAndUpdate(
          documentId,
          { content },
          { new: true }
        );

        socket.to(documentId).emit("text-change", doc.content);
      } catch (err) {
        console.error("Error saving document:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.user);
    });
  });

  return io;
};

module.exports = initializeSocket;
