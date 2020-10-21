import { DuplicateContactException } from 'shared/helpers/CustomErrors';
import * as types from '../../mutation-types';
import ContactAPI from '../../../api/contacts';

export const actions = {
  search: async ({ commit }, { search, page }) => {
    commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: true });
    try {
      const response = await ContactAPI.search(search, page);
      commit(types.default.CLEAR_CONTACTS);
      commit(types.default.SET_CONTACTS, response.data.payload);
      commit(types.default.SET_CONTACT_META, response.data.meta);
      commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: false });
    } catch (error) {
      commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: false });
    }
  },

  get: async ({ commit }, { page }) => {
    commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: true });
    try {
      const response = await ContactAPI.get(page);
      commit(types.default.SET_CONTACTS, response.data.payload);
      commit(types.default.SET_CONTACT_META, response.data.meta);
      commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: false });
    } catch (error) {
      commit(types.default.SET_CONTACT_UI_FLAG, { isFetching: false });
    }
  },

  show: async ({ commit }, { id }) => {
    commit(types.default.SET_CONTACT_UI_FLAG, { isFetchingItem: true });
    try {
      const response = await ContactAPI.show(id);
      commit(types.default.SET_CONTACT_ITEM, response.data.payload);
      commit(types.default.SET_CONTACT_UI_FLAG, {
        isFetchingItem: false,
      });
    } catch (error) {
      commit(types.default.SET_CONTACT_UI_FLAG, {
        isFetchingItem: false,
      });
    }
  },

  update: async ({ commit }, { id, ...updateObj }) => {
    commit(types.default.SET_CONTACT_UI_FLAG, { isUpdating: true });
    try {
      const response = await ContactAPI.update(id, updateObj);
      commit(types.default.EDIT_CONTACT, response.data.payload);
      commit(types.default.SET_CONTACT_UI_FLAG, { isUpdating: false });
    } catch (error) {
      commit(types.default.SET_CONTACT_UI_FLAG, { isUpdating: false });
      if (error.response?.data?.contact) {
        throw new DuplicateContactException(error.response.data.contact);
      } else {
        throw new Error(error);
      }
    }
  },

  updatePresence: ({ commit }, data) => {
    commit(types.default.UPDATE_CONTACTS_PRESENCE, data);
  },

  setContact({ commit }, data) {
    commit(types.default.SET_CONTACT_ITEM, data);
  },
};
