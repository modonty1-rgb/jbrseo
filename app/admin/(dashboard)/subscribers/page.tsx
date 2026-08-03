import { redirect } from "next/navigation";

// Subscribers now live at the admin home (/admin). This route stays as a
// redirect so old links and bookmarks keep working (the subscribers view
// ignores ?country, so nothing to preserve).
export default function AdminSubscribersPage() {
  redirect("/admin");
}
