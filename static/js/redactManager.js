import { simple_query, get_file_list } from "./classes/utils.js";

var dropdown_files = document.getElementById("dropdown-files");
var update_dropdown_btn = document.getElementById("update-dropdown");
var json_data = document.getElementById("json-data");
var load_file_btn = document.getElementById("load-file");
var create_new_file_btn = document.getElementById("create-new-file");
var save_file_btn = document.getElementById("save-file");
var del_file_btn = document.getElementById("del-file");

var input_field = document.getElementById("input-field");

// ? Функция для добавления параметров в выпадающий список
async function add_params(value, name) {
  if (name == null) {
    name = value;
  }
  dropdown_files.innerHTML +=
    '<option value="' + value + '">' + name + "</option>";
}

async function clear_param(value) {
  const options = dropdown_files.options; // Получаем все опции из dropdown
  for (let i = options.length - 1; i >= 0; i--) {
    dropdown_files.remove(i);
  }
}

// ? Получаем файлы и добавляем в список
async function create_dropdown_menu() {
  let files = (await get_file_list("data/jsons"))["files"];
  console.log(files);

  for (let i = 0; i < files.length; i++) {
    add_params(files[i]);
  }
}
create_dropdown_menu();

async function update_dropdown() {
  await clear_param();
  await create_dropdown_menu();
}

update_dropdown_btn.addEventListener("click", () => update_dropdown());

load_file_btn.addEventListener("click", () => load_file());
create_new_file_btn.addEventListener("click", () => create_new_file());
save_file_btn.addEventListener("click", () => save_file());
del_file_btn.addEventListener("click", () => del_file());

async function load_file() {
  json_data.innerText = await simple_query("/set/files/load", {
    path: "data/jsons/" + dropdown_files.value,
  });
}
async function create_new_file() {
  simple_query("/set/files/create", {
    path: "data/jsons/" + input_field.value,
  });
  await update_dropdown();
}
async function save_file() {
  simple_query("/set/files/update", {
    path: "data/jsons/" + dropdown_files.value,
    data: json_data.innerText,
  });
}

async function del_file() {
  simple_query("/set/files/del", { path: "data/jsons/" + input_field.value });
  await update_dropdown();
}
