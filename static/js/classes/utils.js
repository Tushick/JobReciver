// ? Запрашивает данные json
async function simple_query(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.text();
}

async function get_file_list(folder_str) {
  // const response = await fetch("/func/get_list_files", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ folder: folder_str }),
  // });
  // return await response.json();

  return JSON.parse(await simple_query(("/get/list_files"), ({ folder: folder_str })));
}

export { simple_query, get_file_list };
