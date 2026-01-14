import type {
  EmbyLibrary,
  EmbyListResponse,
  EmbyVideo,
} from "~/types/emby.types";

export const useEmbyApi = () => {
  console.log("🔥 useEmbyApi INIT");

  const {request} = useApi();
  const config = useRuntimeConfig();

  const baseUrl = config.public.embyBaseUrl;
  const apiKey = config.public.embyApiKey;

  if (!baseUrl) {
    console.error("❌ embyBaseUrl is undefined");
  }

  const headers = {
    "X-Emby-Token": apiKey,
  };

  return {
    // =========================
    // LIBRARIES
    // =========================
    getLibraries(search?: string) {
      console.log("[EMBY] getLibraries", search);

      return request<EmbyListResponse<EmbyLibrary>>(
        `${baseUrl}/Library/MediaFolders`,
        {
          headers,
          query: search ? {SearchTerm: search} : undefined,
        },
      );
    },

    // =========================
    // VIDEOS PER LIBRARY
    // =========================
    getVideosByLibrary(libraryId: string, search?: string) {
      console.log("[EMBY] getVideosByLibrary", libraryId, search);

      return request<EmbyListResponse<EmbyVideo>>(`${baseUrl}/Items`, {
        headers,
        query: {
          ParentId: libraryId,
          IncludeItemTypes: "Videos",
          Recursive: true,
          ...(search ? {SearchTerm: search} : {}),
        },
      });
    },

    // =========================
    // HELPERS
    // =========================
    posterUrl(itemId: string) {
      return `${baseUrl}/Items/${itemId}/Images/Primary?api_key=${apiKey}`;
    },

    streamUrl(videoId: string) {
      return `${baseUrl}/Videos/${videoId}/stream?api_key=${apiKey}&Static=true`;
    },
    getItem(id: string) {
      return request<EmbyVideo>(`${baseUrl}/Items/${id}`, { headers })
    }
  };
};
