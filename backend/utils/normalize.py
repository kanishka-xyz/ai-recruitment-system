def normalize_list(data, key=None):
    """
    Converts:
    ["React", "Python"]

    OR

    [{"name":"React"},{"name":"Python"}]

    into

    ["React","Python"]
    """

    result = []

    if not data:
        return result

    for item in data:

        if isinstance(item, str):
            result.append(item)

        elif isinstance(item, dict):

            if key and key in item:
                result.append(str(item[key]))

            elif "name" in item:
                result.append(str(item["name"]))

            elif "degree" in item:
                result.append(str(item["degree"]))

            elif "role" in item:
                result.append(str(item["role"]))

            elif "company" in item:
                result.append(str(item["company"]))

            else:
                result.append(" ".join(
                    str(v) for v in item.values()
                ))

    return result