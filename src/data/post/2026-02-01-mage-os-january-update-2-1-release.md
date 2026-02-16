---
title: "Mage-OS January Update"
publishDate: "2026-02-01T00:00:00.000Z"
category: "Updates"
author: "mage-os-team"
draft: false
excerpt: "The Mage-OS community will host a live, fully online hackathon on February 13, bringing developers from around the world together to collaborate in real time...."
image: "~/assets/images/blog/2026/mageos_blog_jan-2025-update.jpg"
---

### Hackathon

The Mage-OS community will host a **live, fully online hackathon on February 13**, bringing developers from around the world together to collaborate in real time. The event is open to everyone, from long-time Mage-OS contributors to newcomers who are eager to help improve the ecosystem. Participants are encouraged to bring their own ideas, challenges, or improvements they would like to work on, with the agenda shaped organically by the community throughout the day. The hackathon is designed to be flexible and inclusive, allowing contributors to join at any time and collaborate globally via Discord. This is an opportunity to build together, share knowledge, and actively help shape the future of Mage-OS.

### Mage-OS Progress and the 2.1.0 Release

The past month marked an important milestone for the Mage-OS project with the official release of **Mage-OS Distribution 2.1.0**. Alongside the release itself, the community delivered meaningful improvements across stability, performance, tooling, and long-term platform direction.

### Mage-OS 2.1.0 Released

Mage-OS 2.1.0 is now available and represents the most polished and robust Mage-OS release to date. The distribution continues to build on a foundation of proven, well-supported technologies, including PHP 8.3 and 8.4, Composer 2.9, OpenSearch 3.x (or Elasticsearch 8), MySQL 8.4, MariaDB 11.x, Redis/Valkey, RabbitMQ, and Varnish.

This release focuses on real-world reliability and developer confidence, with fixes that address long-standing pain points in production environments.

### Bug Fixes and Stability Improvements

Several notable issues were resolved in this release:

- Customer group extension attributes are now preserved correctly instead of being overwritten.

- Customer file attribute handling was fixed to prevent unnecessary filesystem writes.

- Native Full Page Cache behavior for logged-in customers was restored.

- Subresource Integrity (SRI) hash failures caused by JS bundling and minification were resolved.

- Dependency injection compilation now generates plugins in the correct area order, preventing unnecessary frontend cache regeneration.

In addition, the **Mage-OS Page Builder Widgets** module was updated to version **1.3.3**, fixing hidden modal labels and resolving issues with virtual types used as widget block classes.

### New Developer and Operations Features

Mage-OS 2.1.0 introduces new CLI tooling aimed at safer, zero-downtime deployments:

- **Theme registration status command**  
    Detects themes that exist on disk but are not registered in the database, helping teams identify when setup upgrades are required.

- **Queue configuration status command**  
    Identifies inconsistencies in MySQL and AMQP-based message queue configurations, improving observability and deployment safety.

These tools are especially valuable for teams running blue-green or rolling deployment strategies.

### Expanded Database Compatibility

Database support was expanded to better reflect real-world hosting environments:

- **MySQL**: 5.7, 8.0 through 8.4

- **MariaDB**: 10.2 through 10.11, and all 11.x versions

This broader compatibility reduces friction during upgrades and gives operators more flexibility when choosing infrastructure.

### Ecosystem and Infrastructure Progress

Beyond the core release, work continued on improving Mage-OS infrastructure and future direction:

- Repository mirrors were rebuilt and stabilized, resolving Composer 2.9 compatibility and integrity issues.

- Preview and demo environments were restored and are fully operational.

- The **minimal distribution** initiative made major progress, reducing the core module set by more than half in a proof-of-concept build and significantly improving compilation times.

- CI coverage for the release generator was expanded, improving confidence in future releases.

- New community tools and experiments were shared, including devcontainer-based local development setups and testing strategies using Playwright.

### Community Contributions

Mage-OS 2.1.0 was made possible by contributions from across the community, including work on core fixes, tooling, documentation, and extensions. The release reflects ongoing collaboration between maintainers, contributors, and users who continue to shape the platform in the open.

### Looking Ahead

With Mage-OS 2.1.0 now live, attention is already shifting toward future goals, including preparation for Mage-OS 3.0 alongside Magento 2.4.9, PHP 8.5 compatibility, continued work on a minimal distribution, and further improvements to testing and developer experience.

As always, feedback, testing, and contributions are welcome. Join the discussion on GitHub or Discord and help guide the next phase of Mage-OS development.

### Powered by Strong Partnerships

We are proud to collaborate with industry leaders who believe in open source and help accelerate the Mage-OS ecosystem.

#### Gold Partners

<div class="not-prose" style="max-width: 140px;">

[![MDOQ](~/assets/images/blog/2026/image-1-1024x1024.png)](https://opencollective.com/mdoq)

</div>

#### Silver Partners

<div class="not-prose" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; align-items: center;">

<div>

[![ParadoxLabs](~/assets/images/blog/2026/image-2.png)](https://opencollective.com/paradoxlabs)

</div>

<div>

[![Vendic](~/assets/images/blog/2026/image-5-1024x1008.png)](https://opencollective.com/vendic)

</div>

<div>

[![Hyvä](~/assets/images/blog/2026/image-6.png)](https://opencollective.com/hyva-themes)

</div>

<div>

[![Inchoo](~/assets/images/blog/2026/image-7-1024x1024.png)](https://opencollective.com/inchoo)

</div>

</div>

#### Bronze Partners

<div class="not-prose" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem; align-items: center;">

<div>

[![JetRails](~/assets/images/blog/2026/image-8.png)](https://opencollective.com/jetrails)

</div>

<div>

[![Develo](~/assets/images/blog/2026/image-9.png)](https://opencollective.com/develo)

</div>

<div>

[![FindCanary](~/assets/images/blog/2026/image-10.png)](https://opencollective.com/canary)

</div>

<div>

[![integer_net](~/assets/images/blog/2026/image-11.png)](https://opencollective.com/integer_net)

</div>

<div>

[![JH](~/assets/images/blog/2026/image-12.png)](https://opencollective.com/wearejh)

</div>

</div>

**Why Partner With Us?**

Becoming a Mage-OS partner means more than visibility. It means shaping the future of open source commerce, gaining early insights into technical developments, and showcasing your brand to a global audience of merchants, developers, and agencies.

[Learn more about partnership opportunities](/community/partners)
