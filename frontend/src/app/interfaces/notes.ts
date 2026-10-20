export interface NoteUser{
    id:string;
    user_id?:string;
    username?:string;
    avatar?:string;
    can_write:boolean | string;
}

export enum NoteBGColor{
    'Yellow' = '#FFF6CB',
    'Green' = '#E7F6E4',
    'Pink' = '#FFE3F1',
    'Purple' = '#F2E5FF',
    'Blue' = '#F7F7F7',
    'Gray' = '#EDEBE9',
    'Charcoal' = '#5E5E5E',
}


export interface Notes {
    id?:string;
    keep_note_status_id?:string;
    note:string;
    project_id?:string;
    note_date?:string;
    user_id:NoteUser[];
    user_creator?:string;
    user_creator_name?:string;
    created_at?:string;
    updated_at?:string;
    noteBackgroundColor?:string;
}


export interface NoteTeam{
    id?:string,
    name:string
}

export interface NotesRealTime{
    note_id:string;
    refresh_required:boolean;
    users_id?:object;
}