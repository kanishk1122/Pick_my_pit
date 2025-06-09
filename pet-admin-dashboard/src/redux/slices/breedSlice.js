import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData } from "../api";

// Async thunks
export const fetchAllBreeds = createAsyncThunk(
  "breeds/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchData("/breeds/all");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch breeds" }
      );
    }
  }
);

export const fetchBreedsBySpecies = createAsyncThunk(
  "breeds/fetchBySpecies",
  async (speciesId, { rejectWithValue }) => {
    try {
      return await fetchData(`/breeds/by-species/${speciesId}`);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch breeds by species" }
      );
    }
  }
);

export const addBreed = createAsyncThunk(
  "breeds/add",
  async (breedData, { rejectWithValue }) => {
    try {
      return await fetchData("/breeds/add", {
        method: "POST",
        data: breedData,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to add breed" }
      );
    }
  }
);

export const updateBreed = createAsyncThunk(
  "breeds/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await fetchData(`/breeds/update/${id}`, {
        method: "PUT",
        data,
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update breed" }
      );
    }
  }
);

export const toggleBreedStatus = createAsyncThunk(
  "breeds/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/breeds/toggle-status/${id}`, {
        method: "PUT",
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to toggle breed status" }
      );
    }
  }
);

export const deleteBreed = createAsyncThunk(
  "breeds/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await fetchData(`/breeds/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete breed" }
      );
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  currentSpeciesId: null,
};

const breedSlice = createSlice({
  name: "breeds",
  initialState,
  reducers: {
    resetBreedStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    setFilteredBreeds(state, action) {
      state.filteredItems = action.payload;
    },
    setCurrentSpecies(state, action) {
      state.currentSpeciesId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Breeds
      .addCase(fetchAllBreeds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBreeds.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.breeds;
      })
      .addCase(fetchAllBreeds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error occurred";
      })

      // Fetch Breeds By Species
      .addCase(fetchBreedsBySpecies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBreedsBySpecies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredItems = action.payload.breeds;
        state.currentSpeciesId = action.meta.arg; // Store the species ID
      })
      .addCase(fetchBreedsBySpecies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Unknown error occurred";
      })

      // Add Breed
      .addCase(addBreed.fulfilled, (state, action) => {
        state.items.push(action.payload.breed);
        // Update filtered list if applicable
        if (state.currentSpeciesId === action.payload.breed.species) {
          state.filteredItems.push(action.payload.breed);
        }
        state.status = "succeeded";
      })

      // Update Breed
      .addCase(updateBreed.fulfilled, (state, action) => {
        const updatedBreed = action.payload.breed;
        // Update in main items array
        const itemIndex = state.items.findIndex(
          (item) => item._id === updatedBreed._id
        );
        if (itemIndex !== -1) {
          state.items[itemIndex] = updatedBreed;
        }

        // Update in filtered items if present
        const filteredIndex = state.filteredItems.findIndex(
          (item) => item._id === updatedBreed._id
        );
        if (filteredIndex !== -1) {
          // If the breed's species has changed and doesn't match the current filter, remove it
          if (
            updatedBreed.species !== state.currentSpeciesId &&
            state.currentSpeciesId
          ) {
            state.filteredItems.splice(filteredIndex, 1);
          } else {
            state.filteredItems[filteredIndex] = updatedBreed;
          }
        } else if (
          updatedBreed.species === state.currentSpeciesId &&
          state.currentSpeciesId
        ) {
          // If the breed now belongs to the current species filter, add it
          state.filteredItems.push(updatedBreed);
        }

        state.status = "succeeded";
      })

      // Toggle Breed Status
      .addCase(toggleBreedStatus.fulfilled, (state, action) => {
        const { id, active } = action.payload;
        // Update status in items array
        const item = state.items.find((item) => item._id === id);
        if (item) {
          item.active = active;
        }

        // Update in filtered items if present
        const filteredItem = state.filteredItems.find(
          (item) => item._id === id
        );
        if (filteredItem) {
          filteredItem.active = active;
        }

        state.status = "succeeded";
      })

      // Delete Breed
      .addCase(deleteBreed.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.items = state.items.filter((item) => item._id !== id);
        state.filteredItems = state.filteredItems.filter(
          (item) => item._id !== id
        );
        state.status = "succeeded";
      });
  },
});

export const { resetBreedStatus, setFilteredBreeds, setCurrentSpecies } =
  breedSlice.actions;

export default breedSlice.reducer;
