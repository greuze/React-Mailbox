import { createSlice } from "@reduxjs/toolkit";

const initialMailBoxState = {
  mails: [],
  isLoading: false,
};

const mailSlice = createSlice({
  name: "mail",
  initialState: initialMailBoxState,
  reducers: {
    addToInbox: (state, action) => {
      state.mails.push(...action.payload);
    },

    setChecked: (state, action) => {
      const { id, selector } = action.payload;

      if (selector === "single") {
        const mailItem = state.mails.find((item) => item.id === id);
        mailItem.isChecked = !mailItem.isChecked;
      } else if (selector === "all") {
        const checked = state.mails.some((item) => item.isChecked === false);
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: checked,
          };
        });
      } else if (selector === "allMark" || selector === "none") {
        state.mails = state.mails.map((mail) => {
          return {
            ...mail,
            isChecked: selector === "allMark",
          };
        });
      }
    },
    setRead: (state, action) => {
      const { id, email } = action.payload;
      const mailItem = state.mails.find((mail) => mail.id === id);
      mailItem.read = mailItem.read || [];
      if (!mailItem.read.includes(email)) {
        mailItem.read.push(email);
      }
    },
    clearInbox: (state) => {
      state.mails = [];
    },
    setMailsLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  addToInbox,
  setChecked,
  setRead,
  clearInbox,
  setMailsLoading
} = mailSlice.actions;
export default mailSlice.reducer;
