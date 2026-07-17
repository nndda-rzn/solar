export interface CameraState {
  x: number;
  y: number;
  z: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  name: string;
  cameraPosition: CameraState;
  cameraTarget: CameraState | null;
  selectedObject: string | null;
  selectedType: "planet" | "star" | "constellation" | null;
  dayOffset: number;
  scale: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRow {
  id: string;
  user_id: string;
  name: string;
  camera_position: CameraState;
  camera_target: CameraState | null;
  selected_object: string | null;
  selected_type: string | null;
  day_offset: number;
  scale: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookmarkCreatePayload {
  name: string;
  cameraPosition: CameraState;
  cameraTarget: CameraState | null;
  selectedObject: string | null;
  selectedType: "planet" | "star" | "constellation" | null;
  dayOffset: number;
  scale: string;
  thumbnailUrl: string;
}

export function mapBookmarkRow(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    cameraPosition: row.camera_position,
    cameraTarget: row.camera_target,
    selectedObject: row.selected_object,
    selectedType: row.selected_type as Bookmark["selectedType"],
    dayOffset: row.day_offset,
    scale: row.scale,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
