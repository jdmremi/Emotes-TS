export default interface IDanbooruAPIResponse {
    id: number;
    created_at: string;
    uploader_id: number;
    score: number;
    source: string;
    md5: string;
    last_comment_bumped_at: string;
    rating: string;
    image_width: string;
    image_height: string;
    tag_string: string;
    is_note_locked: boolean;
    fav_count: number;
    file_ext: string;
    last_noted_at: string;
    is_rating_locked: boolean;
    parent_id: string;
    has_children: boolean;
    approver_id: number;
    tag_count_general: string;
    tag_count_artist: string;
    tag_count_character: string;
    tag_count_copyright: string;
    file_size: number;
    is_status_locked: boolean;
    pool_string: string;
    up_score: number;
    down_score: number;
    is_pending: boolean;
    is_flagged: boolean;
    is_deleted: boolean;
    tag_count: number;
    updated_at: string;
    is_banned: boolean;
    pixiv_id: number;
    last_commented_at: string;
    has_active_children: boolean;
    bit_flags: number;
    tag_count_meta: number;
    has_large: boolean;
    has_visible_children: boolean;
    tag_string_general: string;
    tag_string_character: string;
    tag_string_copyright: string;
    tag_string_artist: string;
    tag_string_meta: string;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
}