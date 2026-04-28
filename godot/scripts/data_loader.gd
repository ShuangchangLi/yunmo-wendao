extends RefCounted

static func load_json(path: String) -> Variant:
	var text := FileAccess.get_file_as_string(path)
	if text.is_empty():
		push_error("Could not read JSON: %s" % path)
		return {}
	var parsed = JSON.parse_string(text)
	if parsed == null:
		push_error("Could not parse JSON: %s" % path)
		return {}
	return parsed
