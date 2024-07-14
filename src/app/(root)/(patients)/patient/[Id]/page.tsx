"use client";
import ConversationArea from "@/components/patients/ConversationArea";
import GeneratedSoap from "@/components/patients/GeneratedSoap";
import PatientSubHeader from "@/components/patients/patientSubHeader";
import { patientsList } from "@/constants";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { AnimatePresence, motion } from "framer-motion";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useState } from "react";
const names = ["Generated Soap notes", "Note2", "Note3", "Note4"];
const Page = ({ params }: Params) => {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const foundedUser = patientsList.find((user) => user.id == params.Id);
  const [notes, setNotes] = useState<any>("Generated Soap notes");
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<any>("");
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setNotes(value);
  };
  const handleSendMessage = () => {
    setMessages([...messages, { message, type: "sent" }]);
    setMessage("");
  };
  return (
    <div>
      <PatientSubHeader foundedUser={foundedUser} />
      <div className="p-6">
        <div className=" w-full  px-4 mt-4">
          <Select
            displayEmpty
            value={notes}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Placeholder</em>;
              }

              return selected;
            }}
            inputProps={{ "aria-label": "Without label" }}
            className="w-full md:w-[200px] h-[40px]"
          >
            <MenuItem disabled value="">
              <em>Placeholder</em>
            </MenuItem>
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>

        <AnimatePresence>
          {isChatVisible ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className=" flex items-center justify-between sm:flex-row flex-col md:gap-10 gap-4 mt-6 w-full rounded-lg bg-[#EFEFEF] md:py-4 md:px-4 p-2"
            >
              <h1 className=" bg-[#fff] font-bold text-md p-4 md:w-7/12 w-full rounded-xl text-center">
                Coverstaion
              </h1>
              <h1 className=" bg-[#fff] p-4 md:w-7/12 rounded-xl font-bold w-full text-md text-center">
                Generated Soap Notes
              </h1>
              <ArrowDropDownIcon
                className="cursor-pointer scale-150"
                onClick={() => setIsChatVisible(!isChatVisible)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className=" flex items-center justify-between gap-10 mt-6 md:flex-row flex-col"
            >
              <ConversationArea />
              <GeneratedSoap />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <AnimatePresence>
            {isChatVisible && (
              <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 500, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="chat-container min-h-[500px] bg-[#EFEFEF] rounded-xl"
              >
                <div className="chat-box h-full overflow-y-auto p-4 space-y-4">
                  {messages.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`${
                        msg.type === "sent" ? "flex-row-reverse" : ""
                      } flex gap-4 `}
                    >
                      <div
                        className={`${
                          msg.type === "sent"
                            ? "bg-primary-500 text-white"
                            : "bg-[#fff] text-gray-700"
                        } p-2 rounded-xl `}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            exit={{ y: 500, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-[#EFEFEF] w-full flex gap-3 rounded-xl px-2 mt-4"
          >
            <input
              type="text"
              className="w-full p-2 bg-[#EFEFEF] rounded-xl outline-none"
              placeholder="Type a message"
              onFocus={() => setIsChatVisible(true)}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="text-sm text-primary-500"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;
