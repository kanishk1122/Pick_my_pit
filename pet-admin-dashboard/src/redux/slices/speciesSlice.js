import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api";

// Async thunks
export const fetchAllSpecies = createAsyncThunk(
  "species/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/species/all");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch species" }
      );
    }
  }
);

export const fetchActiveSpecies = createAsyncThunk(
  "species/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/species");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch active species" }
      );
    }
  }
);

export const addSpecies = createAsyncThunk(
  "species/add",
  async (speciesData, { rejectWithValue }) => {
    try {
      return await fetchData("/species/add", {
        method: "POST",
        data: speciesData,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add species" }
      );
    }
  }
);

export const updateSpecies = createAsyncThunk(
  "species/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await fetchData(`/species/update/${id}`, {
        method: "PUT",
        data,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update species" }
      );
    }
  }
);

export const toggleSpeciesStatus = createAsyncThunk(
  "species/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/species/toggle-status/${id}`, {
        method: "PUT",
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to toggle species status" }
      );
    }
  }
);

export const deleteSpecies = createAsyncThunk(
  "species/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/species/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete species" }
      );
    }
  }
);

const initialState = {
  items: [],
  activeItems: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const speciesSlice = createSlice({
  name: "species",
  initialState,
  reducers: {
    resetSpeciesStatus(state) {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Species
      .addCase(fetchAllSpecies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllSpecies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.species;
      })
      .addCase(fetchAllSpecies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error occurred";
      })

      // Fetch Active Species
      .addCase(fetchActiveSpecies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveSpecies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeItems = action.payload.species;
      })
      .addCase(fetchActiveSpecies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error occurred";
      })

      // Add Species
      .addCase(addSpecies.fulfilled, (state, action) => {
        state.items.push(action.payload.species);
        if (action.payload.species.active) {
          state.activeItems.push(action.payload.species);
        }
        state.status = "succeeded";
      })

      // Update Species
      .addCase(updateSpecies.fulfilled, (state, action) => {
        const updatedSpecies = action.payload.species;
        // Update in items array
        const itemIndex = state.items.findIndex(
          (item) => item._id === updatedSpecies._id
        );
        if (itemIndex !== -1) {
          state.items[itemIndex] = updatedSpecies;
        }

        // Update in activeItems if present
        const activeIndex = state.activeItems.findIndex(
          (item) => item._id === updatedSpecies._id
        );
        if (activeIndex !== -1 && updatedSpecies.active) {
          state.activeItems[activeIndex] = updatedSpecies;
        } else if (activeIndex !== -1 && !updatedSpecies.active) {
          // Remove from active items if no longer active
          state.activeItems.splice(activeIndex, 1);
        } else if (activeIndex === -1 && updatedSpecies.active) {
          // Add to active items if newly active
          state.activeItems.push(updatedSpecies);
        }

        state.status = "succeeded";
      })

      // Toggle Species Status
      .addCase(toggleSpeciesStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        // Update status in items array
        const item = state.items.find((item) => item._id === id);
        if (item) {
          item.active = status;
        }

        // Update activeItems accordingly
        if (status) {
          // If activated and not in activeItems, add it
          const activeItem = state.items.find((item) => item._id === id);
          if (activeItem && !state.activeItems.some((ai) => ai._id === id)) {
            state.activeItems.push(activeItem);
          }
        } else {
          // If deactivated, remove from activeItems
          state.activeItems = state.activeItems.filter(
            (item) => item._id !== id
          );
        }

        state.status = "succeeded";
      })

      // Delete Species
      .addCase(deleteSpecies.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter((item) => item._id !== id);
        state.activeItems = state.activeItems.filter((item) => item._id !== id);
        state.status = "succeeded";
      });
  },
});

export const { resetSpeciesStatus } = speciesSlice.actions;

export default speciesSlice.reducer;
