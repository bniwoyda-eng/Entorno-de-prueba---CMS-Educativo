import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  X,
  MessageSquare,
  Info,
  ArrowLeft,
  Search,
  MessagesSquare,
  MessageSquarePlus,
  Send,
  InfoIcon,
} from "lucide-react"; // Íconos opcionales
import {
  useChatMessages,
  useChatPreviews,
  useColleagues,
} from "../api/educators.queries";
import {
  useFindOrCreateChat,
  useMarkAsRead,
  useSendMessage,
} from "../api/educators.mutations";
import { useAuthStore } from "../../auth/auth.store";
import { IChatPreview, IChatMessage } from "../types/chats.types";
import { ISuggestedEducator } from "../types";
import { formatDate } from "../../../utils";
import { useChatSocketStore } from "../stores/useChatStocketStore";
import { format, isToday } from "date-fns";

export const Chat = () => {
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [leftView, setLeftView] = useState<"colleagues" | "chats">("chats");

  const [selectedChat, setSelectedChat] = useState<string | null>();
  const [targetEducator, setTargetEducator] =
    useState<ISuggestedEducator | null>(null);

  const { data } = useChatPreviews();

  // Actualizar el targetEducator cuando se selecciona un chat
  useEffect(() => {
    if (data) {
      const selectedEducator = data.find(
        (chat) => chat.chatId === selectedChat
      )?.participant;
      if (selectedEducator) {
        setTargetEducator({
          id: selectedEducator.id,
          fullName: selectedEducator.name,
          profilePicture: selectedEducator.avatar,
          totalPosts: 0,
        } as ISuggestedEducator);
      } else {
        setTargetEducator(null);
      }
    } else {
      setTargetEducator(null);
    }
  }, [data, selectedChat]);

  // ✅ Cerrar modal en mobile si se selecciona un chat
  useEffect(() => {
    if (selectedChat && targetEducator && isMobileChatOpen) {
      setIsMobileChatOpen(false);
    }
  }, [selectedChat, targetEducator]);

  return (
    <div className="h-full p-4 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Panel de mensajes */}
        <div className="col-span-1 lg:col-span-2 flex flex-col max-h-[calc(100vh-95px)]">
          {selectedChat ? (
            <ChatSelected
              selectedChat={selectedChat}
              targetEducator={targetEducator}
            />
          ) : (
            <NoChatSelected />
          )}
        </div>

        {/* Panel lateral en lg+ */}
        <div className="card col-span-1 flex-col max-h-[calc(100vh-95px)] hidden lg:flex">
          {leftView === "chats" ? (
            <ColleaguesChats
              setLeftView={setLeftView}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              setTargetEducator={setTargetEducator}
            />
          ) : (
            <ColleaguesList
              setLeftView={setLeftView}
              setSelectedChat={setSelectedChat}
              setTargetEducator={setTargetEducator}
            />
          )}
        </div>
      </div>

      {/* Botón flotante para abrir en móvil */}
      <button
        className="fixed top-24 right-8 lg:hidden z-40 p-3 rounded-full bg-main-400 text-white shadow-lg hover:bg-main-300 transition duration-200"
        onClick={() => setIsMobileChatOpen(true)}
        title="Open chat"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Panel lateral en móvil */}
      {isMobileChatOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileChatOpen(false)}
          />
          <div className="fixed top-0 right-0 w-80 max-w-full h-full bg-white z-40 shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Chats</h2>
              <button onClick={() => setIsMobileChatOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {leftView === "chats" ? (
              <ColleaguesChats
                setLeftView={setLeftView}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                setTargetEducator={setTargetEducator}
              />
            ) : (
              <ColleaguesList
                setLeftView={setLeftView}
                setSelectedChat={setSelectedChat}
                setTargetEducator={setTargetEducator}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

interface IChatSelectedProps {
  selectedChat: string | null;
  targetEducator: ISuggestedEducator | null;
}

// ChatSelected.tsx
export const ChatSelected = ({
  selectedChat,
  targetEducator,
}: IChatSelectedProps) => {
  if (!selectedChat) return null;

  const user = useAuthStore((state) => state.user);
  const currentEducatorId = user?.educatorId;
  if (!currentEducatorId) return null;

  const { receivedMessage: socketMessage } = useChatSocketStore();
  const onlineEducators = useChatSocketStore((s) => s.onlineEducators);
  const isOnline = onlineEducators.includes(targetEducator?.id ?? "");

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useChatMessages(selectedChat);
  const { mutate: sendMessage, isPending: isSending } =
    useSendMessage(selectedChat);
  const { refetch } = useChatPreviews();

  const [newMessage, setNewMessage] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef<number>(0);

  const baseMessages = useMemo(() => {
    if (!data?.pages) return [];
    return [...data.pages].reverse().flatMap((page) => page.messages);
  }, [data]);

  const [socketMessages, setSocketMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    if (socketMessage && socketMessage.chat.id === selectedChat) {
      setSocketMessages((prev) => {
        const exists = prev.some((m) => m.id === socketMessage.id);
        return exists ? prev : [...prev, socketMessage];
      });
    }
  }, [socketMessage, selectedChat]);

  const allMessages = useMemo(() => {
    const ids = new Set<string>();
    return [...baseMessages, ...socketMessages].filter((msg) => {
      if (ids.has(msg.id)) return false;
      ids.add(msg.id);
      return true;
    });
  }, [baseMessages, socketMessages]);

  // Limpiar mensajes de socket al cambiar de chat
  useEffect(() => {
    if (selectedChat) {
      setSocketMessages([]);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;

    // Esperar un pequeño delay para que se rendericen los mensajes
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100); // 100ms suele ser suficiente

    return () => clearTimeout(timeout);
  }, [selectedChat]);

  // Agregar mensaje recibido por socket si no existe
  useEffect(() => {
    if (socketMessage) {
      refetch();
    }
  }, [socketMessage]);

  // Detectar scroll arriba con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          prevHeightRef.current = scrollContainerRef.current?.scrollHeight ?? 0;
          fetchNextPage();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5,
      }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (
      !isFetchingNextPage &&
      scrollContainerRef.current &&
      prevHeightRef.current > 0
    ) {
      const newHeight = scrollContainerRef.current.scrollHeight;
      const diff = newHeight - prevHeightRef.current;
      scrollContainerRef.current.scrollTop = diff;
    }
  }, [data]);

  // Auto scroll al fondo cuando se cargan nuevas páginas (primer carga)
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage, {
      onSuccess: () => {
        setNewMessage("");
        refetch();
        setTimeout(scrollToBottom, 100);
      },
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full card">
      {/* Header del chat */}
      <div className="flex-center h-16 mb-2 px-4 pb-4 border-b">
        {targetEducator && (
          <div className="flex items-center gap-2">
            <img
              src={targetEducator.profilePicture}
              alt={targetEducator.fullName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <NavLink
                to={`/educators/posts/author/${targetEducator.id}`}
                className="text-lg font-medium hover:text-main-400 hover:underline"
                title="View profile"
              >
                {targetEducator.fullName}
              </NavLink>
              <SpanIsOnline isOnline={isOnline} />
            </div>
          </div>
        )}
      </div>

      {/* Área scrollable de mensajes */}
      <div
        className="overflow-y-auto flex-1 px-4 pb-4"
        ref={scrollContainerRef}
      >
        <div className="flex flex-col gap-2">
          <div ref={topSentinelRef} />

          {allMessages.length === 0 && (
            <div className="text-sm text-gray-500 flex-center gap-2 my-2">
              <InfoIcon className="w-5 h-5" />
              No messages yet. Start the conversation!
            </div>
          )}

          {allMessages.map((message, index) => {
            const isMine = message.sender.id === currentEducatorId;

            const currentDate = formatDate(message.creation_date, "dd/MM/yyyy");
            const prevMessage = index > 0 ? allMessages[index - 1] : null;
            const prevDate = prevMessage
              ? formatDate(prevMessage.creation_date, "dd/MM/yyyy")
              : null;

            const showDateDivider = currentDate !== prevDate;

            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <div className="text-center text-white text-xs my-4">
                    <span className="px-3 py-1 bg-main-400 rounded-lg inline-block">
                      {isToday(new Date(message.creation_date))
                        ? "Hoy"
                        : currentDate}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-xl max-w-[75%] ${
                      isMine
                        ? "bg-main-300 text-white"
                        : "bg-gray-300 text-gray-900"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {formatDate(message.creation_date, "dd/MM/yyyy HH:mm")}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {isFetchingNextPage && (
            <div className="text-sm text-gray-500 text-center my-2">
              Loading more messages...
            </div>
          )}
        </div>
      </div>

      {/* Input fijo al fondo */}
      <div className="border-t pt-3 mt-3 flex items-start gap-2">
        <textarea
          placeholder="Type a message..."
          className="form-control"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          onFocus={scrollToBottom}
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={isSending || !newMessage.trim()}
          className="bg-main-400 flex-center text-white px-4 py-2 rounded-xl text-sm hover:bg-main-300 disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-1 inline-block" />
          Send
        </button>
      </div>
    </div>
  );
};

// NoChatSelected.tsx
export const NoChatSelected = () => {
  return (
    <div className="flex-center h-full rounded-xl shadow-sm">
      <div className="flex flex-col items-center">
        <MessagesSquare className="w-20 h-20 text-gray-500 mb-2" />
        <h2 className="text-xl text-dark">Select a chat to start...</h2>
      </div>
    </div>
  );
};

// ColleaguesChats.tsx
interface IColleaguesChatsProps {
  setLeftView: (view: "colleagues" | "chats") => void;
  selectedChat: string | null | undefined;
  setSelectedChat: (chatId: string | null) => void;
  setTargetEducator: (educator: ISuggestedEducator | null) => void;
}
export const ColleaguesChats = ({
  setLeftView,
  selectedChat,
  setSelectedChat,
  setTargetEducator,
}: IColleaguesChatsProps) => {
  const { data: chats, isLoading, isError, refetch } = useChatPreviews();
  const { mutate: markAsRead } = useMarkAsRead();

  const {
    receivedMessage: socketMessage,
    notification,
    setNotification,
  } = useChatSocketStore();

  useEffect(() => {
    if (notification) {
      setNotification(false);
    }
  }, []);

  useEffect(() => {
    if (socketMessage) {
      refetch();
    }
  }, [socketMessage]);

  const handleSelectChat = (chat: IChatPreview) => {
    setSelectedChat(chat.chatId);
    setTargetEducator({
      id: chat.participant.id,
      fullName: chat.participant.name,
      profilePicture: chat.participant.avatar,
      totalPosts: 0,
    } as ISuggestedEducator);
    if (chat.unreadCount > 0) {
      markAsRead(chat.chatId);
    }
  };

  return (
    <div className="p-1 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center text-lg font-medium">
          <MessagesSquare className="w-5 h-5 mr-2 inline-block" />
          Chats
        </h2>
        <button onClick={() => setLeftView("colleagues")}>
          <MessageSquarePlus className="w-6 h-6 text-main-400" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 pr-2">
        {isLoading ? (
          <div className="flex-center h-16">
            <div className="loader" />
          </div>
        ) : isError ? (
          <p className="bg-red-100 text-red-500 text-sm p-3 rounded-xl">
            <Info className="inline-block mr-1" />
            Error loading chats.
          </p>
        ) : chats?.length === 0 ? (
          <p className="bg-gray-100 text-gray-500 text-sm p-3 rounded-xl">
            <Info className="inline-block mr-1" />
            No chats found.
          </p>
        ) : (
          chats?.map((chat) => (
            <Fragment key={chat.chatId}>
              {chat.lastMessage && (
                <button
                  key={chat.chatId}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex justify-between p-2 hover:bg-gray-100 cursor-pointer w-full border-t ${
                    selectedChat === chat.chatId ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex">
                    <img
                      src={chat.participant.avatar}
                      alt={chat.participant.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">
                        {chat.participant.name}
                      </p>
                      {chat.lastMessage && (
                        <p className="text-gray-500 text-xs">
                          {chat.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">
                      {isToday(new Date(chat.lastMessage.timestamp))
                        ? format(new Date(chat.lastMessage.timestamp), "HH:mm")
                        : format(new Date(chat.lastMessage.timestamp), "dd/MM")}
                    </p>

                    {chat.unreadCount > 0 && selectedChat !== chat.chatId && (
                      <span className="ml-auto bg-main-300 text-white text-xs font-bold px-2 rounded-full">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              )}
            </Fragment>
          ))
        )}
      </div>
    </div>
  );
};

// ColleaguesList.tsx
interface IColleaguesListProps {
  setLeftView: (view: "colleagues" | "chats") => void;
  setSelectedChat: (chatId: string | null) => void;
  setTargetEducator: (educator: ISuggestedEducator | null) => void;
}
export const ColleaguesList = ({
  setLeftView,
  setSelectedChat,
  setTargetEducator,
}: IColleaguesListProps) => {
  const { data: colleagues, isLoading, isError } = useColleagues();
  const { mutate: findOrCreate } = useFindOrCreateChat();
  const [searchTerm, setSearchTerm] = useState("");
  const onlineEducators = useChatSocketStore((s) => s.onlineEducators);

  const filteredAndGrouped = useMemo(() => {
    if (!colleagues) return {};
    const filtered = colleagues.filter((c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return groupByFirstLetter(filtered);
  }, [colleagues, searchTerm]);

  const handleColleagueClick = (colleague: ISuggestedEducator) => {
    findOrCreate(colleague.id, {
      onSuccess: (chat) => {
        setSelectedChat(chat.id);
        setTargetEducator(colleague);
        setLeftView("chats");
      },
    });
  };

  return (
    <div className="p-1 h-full flex flex-col">
      {/* BOTÓN VOLVER */}
      <button
        className="flex items-center text-gray-800 mb-4"
        onClick={() => setLeftView("chats")}
        title="Go back to chats"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Go back
      </button>

      {/* INPUT DE BÚSQUEDA */}
      <div className="flex gap-3 form-control">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search username"
          className="outline-none border-0 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TÍTULO */}
      <h2 className="my-3 text-lg font-medium">
        Colleagues list
        <span className="text-gray-500 text-sm">
          {colleagues?.length ? ` (${colleagues.length})` : ""}
        </span>
      </h2>

      {/* LISTA DE COLEGAS */}
      <div className="overflow-y-auto flex-1 pr-2">
        {isLoading ? (
          <div className="flex-center h-16">
            <div className="loader" />
          </div>
        ) : isError ? (
          <p className="bg-red-100 text-red-500 text-sm p-3 rounded-xl">
            <Info className="inline-block mr-1" />
            Error loading colleagues.
          </p>
        ) : colleagues?.length === 0 ? (
          <p className="bg-gray-100 text-gray-500 text-sm p-3 rounded-xl">
            <Info className="inline-block mr-1" />
            No colleagues found.
          </p>
        ) : // Si no hay resultados, mostrar un mensaje
        Object.keys(filteredAndGrouped).length === 0 ? (
          <p className="bg-gray-100 text-gray-500 text-sm p-3 rounded-xl">
            <Info className="inline-block mr-1" />
            No results found.
          </p>
        ) : (
          Object.entries(filteredAndGrouped).map(([letter, group]) => (
            <div key={letter} className="mb-2">
              <h3 className="font-medium text- border-b mb-1">{letter}</h3>
              {group.map((colleague) => (
                <button
                  key={colleague.id}
                  className="flex items-center hover:bg-main-100 p-1 rounded-lg cursor-pointer w-full focus:bg-main-100 focus:outline-none"
                  onClick={() => handleColleagueClick(colleague)}
                >
                  <img
                    src={colleague.profilePicture}
                    alt={colleague.fullName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-sm">{colleague.fullName}</p>
                    <SpanIsOnline
                      isOnline={onlineEducators.includes(colleague.id)}
                    />
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const groupByFirstLetter = (list: ISuggestedEducator[]) => {
  const grouped: Record<string, ISuggestedEducator[]> = {};

  list.forEach((colleague) => {
    const firstLetter = colleague.fullName.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) grouped[firstLetter] = [];
    grouped[firstLetter].push(colleague);
  });

  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key].sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );
      return acc;
    }, {} as typeof grouped);
};

const SpanIsOnline = ({ isOnline }: { isOnline: boolean }) => {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <span
        className={`text-base ${
          isOnline ? "text-green-500 animate-ping-slow" : "text-gray-400"
        }`}
      >
        ●
      </span>
      <span className="text-xs">{isOnline ? "Online" : "Offline"}</span>
    </div>
  );
};
