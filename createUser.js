document
  .getElementById("createUserForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;

    try {
      const response = await fetch(
        "https://crudnodejs-production.up.railway.app/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        }
      );

      const responseData = await response.json();
      if (!response.ok)
        throw new Error(responseData.message || "Create user failed");

      alert("Create user success");
      console.log("Success:", responseData);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error create user : ${error.message}`);
    }
  });

const openCreateModalButton = document.getElementById("openCreateModal");
openCreateModalButton.addEventListener("click", () => {
  userModal.classList.add("active");
});

async function getUsers() {
  try {
    const response = await fetch(
      "https://crudnodejs-production.up.railway.app/api/users"
    );
    const users = await response.json();
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className = "user-card";

      userCard.innerHTML = `
          <div class="user-info">
            <strong>${user.name}</strong>
            <span>${user.email}</span>
          </div>
          <div class="user-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;

      userList.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

window.onload = getUsers;

const closeModalButton = document.getElementById("closeModal");
closeModalButton.addEventListener("click", () => {
  // Đóng modal khi nhấn nút Cancel
  document.getElementById("userModal").classList.remove("active");
});

// Thêm sự kiện cho nút "Cancel" trong phần modal actions
const cancelButton = document.getElementById("cancelButton");
cancelButton.addEventListener("click", () => {
  document.getElementById("userModal").classList.remove("active");
});

function openDeleteModal(userId) {
  const modal = document.getElementById("deleteModal");
  modal.setAttribute("data-state", "open");
  modal.dataset.userId = userId; // Lưu lại ID người dùng cần xóa
}

// Đóng modal xác nhận xóa
function closeDeleteModal() {
  const modal = document.getElementById("deleteModal");
  modal.setAttribute("data-state", "closed");
}

// Xử lý xóa người dùng
async function deleteUser() {
  const modal = document.getElementById("deleteModal");
  const userId = modal.dataset.userId; // Lấy ID người dùng từ dữ liệu modal

  try {
    const response = await fetch(
      `https://crudnodejs-production.up.railway.app/api/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Xóa người dùng không thành công!");
    }

    alert("Xóa người dùng thành công!");
    closeDeleteModal(); // Đóng modal sau khi xóa thành công
    getUsers(); // Cập nhật lại danh sách người dùng
  } catch (error) {
    alert(error.message); // Hiển thị thông báo lỗi
  }
}

// Cập nhật danh sách người dùng sau khi xóa
async function getUsers() {
  try {
    const response = await fetch(
      "https://crudnodejs-production.up.railway.app/api/users"
    );
    const users = await response.json();
    const userList = document.getElementById("userList");
    userList.innerHTML = "";

    users.forEach((user) => {
      const userCard = document.createElement("div");
      userCard.className = "user-card";
      userCard.innerHTML = `
        <div class="user-info">
          <strong>${user.name}</strong>
          <span>${user.email}</span>
        </div>
        <div class="user-actions">
          <button class="edit-btn" onclick="editUser('${user._id}')">Edit</button>
          <button class="delete-btn" onclick="openDeleteModal('${user._id}')">Delete</button>
        </div>
      `;
      userList.appendChild(userCard);
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Hàm xóa người dùng trực tiếp
async function deleteUserDirect(userId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this user? This action cannot be undone."
  ); // Hiển thị thông báo xác nhận

  if (!confirmDelete) return; // Nếu người dùng nhấn "Cancel", thoát hàm

  try {
    // Gửi yêu cầu DELETE tới API
    const response = await fetch(
      `https://crudnodejs-production.up.railway.app/api/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Xóa người dùng không thành công!");
    }

    alert("Xóa người dùng thành công!");
    getUsers(); // Cập nhật lại danh sách người dùng sau khi xóa
  } catch (error) {
    alert(`Lỗi: ${error.message}`); // Hiển thị thông báo lỗi
  }
}
