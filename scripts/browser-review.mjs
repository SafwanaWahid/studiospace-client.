import { chromium } from "playwright";
(async () => {
  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {}),
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const titles = [
    "Daylight Portrait Studio",
    "Frame One Production Stage",
    "The Conversation Room",
    "Afterhours Sound Suite",
    "Common Ground Workshop",
    "Colour Room Studio",
  ];
  const cats = [
    "Photo Studio",
    "Film Stage",
    "Podcast Lounge",
    "Music Suite",
    "Workshop",
    "Photo Studio",
  ];
  const photos = [
    "photo-studio",
    "film-stage",
    "podcast-room",
    "music-suite",
    "workshop",
    "color-studio",
  ];
  let authenticated = false;
  const account = {
    user: {
      id: "review-user",
      name: "Review Host",
      email: "host@example.com",
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    session: {
      id: "review-session",
      userId: "review-user",
      token: "review-token",
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  const spaces = titles.map((title, i) => ({
    _id: "00000000000000000000000" + i,
    title,
    category: cats[i],
    hourlyRate: [65, 120, 40, 55, 35, 80][i],
    deposit: 100,
    capacity: 8,
    location: [
      "Dhanmondi, Dhaka",
      "Tejgaon, Dhaka",
      "Banani, Dhaka",
      "Uttara, Dhaka",
      "Mirpur, Dhaka",
      "Gulshan, Dhaka",
    ][i],
    images: ["/media/" + photos[i] + ".jpg"],
    amenities: ["Wi-Fi", "Natural light", "Lighting equipment"],
    overview:
      "A studio for portraits, product photography, and small creative teams. Check included equipment and arrange your arrival with the host before the session.",
    ownerName: "Test Host",
    ownerEmail: "host@example.com",
    rating: 0,
    reviewCount: 0,
    availability: [],
    reviews: [],
  }));
  const reservation = {
    _id: "eeeeeeeeeeeeeeeeeeeeeeee",
    studioId: spaces[1]._id,
    studioTitle: spaces[1].title,
    studioImage: spaces[1].images[0],
    location: spaces[1].location,
    start: new Date(Date.now() + 172800000).toISOString(),
    end: new Date(Date.now() + 180000000).toISOString(),
    total: 340,
    hours: 2,
    deposit: 100,
    hourlyRate: 120,
    status: "Pending",
    userName: "Review Creator",
  };
  await page.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    const method = route.request().method();
    const body = ["POST", "PATCH"].includes(method)
      ? route.request().postDataJSON()
      : null;
    let data = null;
    if (url.pathname === "/api/auth/get-session")
      data = authenticated ? account : null;
    else if (url.pathname === "/api/access") data = { success: true };
    else if (url.pathname === "/api/my-listings")
      data = spaces.filter((s) => s.ownerEmail === account.user.email);
    else if (url.pathname === "/api/bookings")
      data = method === "POST" ? { ...reservation, ...body } : [reservation];
    else if (url.pathname.startsWith("/api/bookings/")) {
      Object.assign(reservation, body);
      data = { success: true };
    } else if (url.pathname === "/api/studios") {
      if (method === "POST") {
        const studio = {
          ...body,
          _id: "ffffffffffffffffffffffff",
          ownerName: account.user.name,
          ownerEmail: account.user.email,
          rating: 0,
          reviewCount: 0,
        };
        spaces.push(studio);
        data = studio;
      } else {
        data = spaces.filter(
          (s) =>
            !url.searchParams.get("category") ||
            s.category === url.searchParams.get("category"),
        );
        if (url.searchParams.get("search"))
          data = data.filter((s) =>
            (s.title + " " + s.location)
              .toLowerCase()
              .includes(url.searchParams.get("search").toLowerCase()),
          );
        if (url.searchParams.get("sort") === "price-low")
          data.sort((a, b) => a.hourlyRate - b.hourlyRate);
      }
    } else if (url.pathname.startsWith("/api/studios/")) {
      const index = spaces.findIndex(
        (s) => s._id === url.pathname.split("/").pop(),
      );
      if (method === "DELETE") {
        spaces.splice(index, 1);
        data = { success: true };
      } else if (method === "PATCH") {
        Object.assign(spaces[index], body);
        data = { success: true };
      } else data = { ...spaces[index], availability: [], reviews: [] };
    } else if (url.pathname === "/api/config") data = { googleEnabled: false };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(data),
    });
  });
  await page.goto(process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100", {
    waitUntil: "networkidle",
  });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  const broken = await page
    .locator("img")
    .evaluateAll((items) =>
      items.filter((el) => el.complete && !el.naturalWidth).map((el) => el.src),
    );
  if (broken.length) throw Error("Broken images: " + broken.join(","));
  const checks = [];
  if ((await page.locator(".studio-card").count()) !== 6)
    throw Error("Expected 6 studio cards");
  checks.push("six studio cards");
  const firstImage = await page
    .locator(".cover-frame img")
    .first()
    .evaluate((el) => ({ width: el.naturalWidth, loaded: el.complete }));
  if (!firstImage.width) throw Error("Hero image failed");
  checks.push("local hero image");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  await page.waitForTimeout(200);
  if (
    !(await page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark")))
  )
    throw Error("Theme failed");
  await page.reload({ waitUntil: "networkidle" });
  if (
    !(await page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark")))
  )
    throw Error("Theme persistence failed");
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  checks.push("dark theme persisted");
  await page.locator(".home-search select").selectOption("Photo Studio");
  await page.locator(".home-search input").fill("Dhanmondi");
  await page.getByRole("button", { name: "Find a space", exact: true }).click();
  await page.waitForURL("**/studios?**");
  await page.waitForLoadState("networkidle");
  if ((await page.locator(".studio-card").count()) !== 1)
    throw Error("Hero search failed");
  checks.push("hero category + location search");
  await page.goto(
    `${process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100"}/studios?category=Photo%20Studio`,
    { waitUntil: "networkidle" },
  );
  if ((await page.locator(".studio-card").count()) !== 2)
    throw Error("Category selection failed");
  checks.push("category selection");

  await page.goto(
    `${process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100"}/studios/000000000000000000000000`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("button", { name: "Book workspace now" }).click();
  await page.waitForURL("**/login?next=**");
  checks.push("booking login redirect");
  await page.goto(
    `${process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100"}/register`,
    { waitUntil: "networkidle" },
  );
  await page.locator("input[name=name]").fill("New Creator");
  await page.locator("input[name=email]").fill("new@example.com");
  await page.locator("input[name=password]").fill("abcdef");
  await page
    .getByRole("button", { name: "Create your account", exact: true })
    .click();
  await page.getByRole("alert").filter({ hasText: "uppercase" }).waitFor();
  checks.push("password validation");

  await page.goto(
    `${process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100"}/my-listings`,
    { waitUntil: "networkidle" },
  );
  await page.waitForURL("**/login?next=**");
  checks.push("private route redirect");
  await page.goto(
    `${process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100"}/no-such-page`,
    { waitUntil: "networkidle" },
  );
  await page.getByRole("link", { name: "Return to home" }).waitFor();
  checks.push("404 recovery");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(process.env.STUDIO_REVIEW_URL || "http://127.0.0.1:3100", {
      waitUntil: "networkidle",
    });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    if (overflow) throw Error("Overflow at " + width);
    await page.screenshot({
      path: "/tmp/studio-home-" + width + "-v2.png",
      fullPage: true,
    });
    checks.push("no overflow " + width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("link", { name: "Explore studios" })
    .click();
  await page.waitForURL("**/studios");
  checks.push("mobile navigation");
  authenticated = true;
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${process.env.STUDIO_REVIEW_URL}/dashboard`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("heading", { name: "Welcome, Review." }).waitFor();
  checks.push("signed-in dashboard");
  await page.goto(`${process.env.STUDIO_REVIEW_URL}/add-studio`, {
    waitUntil: "networkidle",
  });
  await page.locator("input[name=title]").fill("UI review studio");
  await page.locator("select[name=category]").selectOption("Photo Studio");
  await page.locator("input[name=hourlyRate]").fill("75");
  await page.locator("input[name=deposit]").fill("100");
  await page.locator("input[name=capacity]").fill("6");
  await page.locator("input[name=location]").fill("Dhaka");
  await page
    .locator("textarea")
    .first()
    .fill(`${process.env.STUDIO_REVIEW_URL}/media/photo-studio.jpg`);
  await page
    .locator("textarea[name=overview]")
    .fill(
      "A spacious studio for photography and creative production with included lighting equipment.",
    );
  await page.getByRole("checkbox", { name: "Wi-Fi", exact: true }).check();
  await page
    .getByRole("button", { name: "Publish your studio", exact: true })
    .click();
  await page.waitForURL("**/my-listings");
  await page
    .getByRole("heading", { name: "UI review studio", exact: true })
    .waitFor();
  checks.push("studio creation form");
  let row = page
    .locator(".listing-row")
    .filter({ hasText: "UI review studio" });
  await row.getByRole("link", { name: "Update", exact: true }).click();
  await page.waitForURL("**/studios/edit/**");
  await page.locator("input[name=title]").waitFor();
  if (
    (await page.locator("input[name=title]").inputValue()) !==
    "UI review studio"
  )
    throw Error("Edit form not prefilled");
  await page.locator("input[name=title]").fill("Updated review studio");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.waitForURL("**/my-listings");
  await page
    .getByRole("heading", { name: "Updated review studio", exact: true })
    .waitFor();
  checks.push("prefilled edit form and save");
  row = page
    .locator(".listing-row")
    .filter({ hasText: "Updated review studio" });
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "Keep studio", exact: true }).click();
  if ((await row.count()) !== 1) throw Error("Cancel delete removed studio");
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("button", { name: "Delete studio", exact: true })
    .click();
  await row.waitFor({ state: "detached" });
  checks.push("deletion confirmation and cancellation");
  await page.goto(`${process.env.STUDIO_REVIEW_URL}/dashboard`, {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Confirm", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  const focusInDialog = await page.evaluate(() =>
    Boolean(document.activeElement?.closest("dialog")),
  );
  if (!focusInDialog) throw Error("Dialog did not receive focus");
  await page
    .getByRole("button", { name: "Confirm change", exact: true })
    .click();
  await page.locator(".status-confirmed").waitFor();
  checks.push("host confirmation dialog and focus");
  console.log(JSON.stringify({ checks, errors }, null, 2));
  await browser.close();
  if (errors.length) process.exit(1);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
