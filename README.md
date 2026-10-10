# FFVIII • Garden — 0.2.0

A SillyTavern UI extension with blue menus and silver borders, the active Persona as protagonist, Guardian Forces, magic stocks, manual Junctions, inventory, and an event log. The center panel remains SillyTavern's native chat.

Version 0.2.0 adds campaign tracking and automatic response restoration. It uses English throughout the interface, catalog, notifications, validation messages, documentation, and AI instructions. Existing v0.1 save files remain compatible. The extension does not override your roleplay language or translate your Persona, original GF names, or custom descriptions.

## Install from GitHub

1. Open **Extensions → Install Extension** in SillyTavern.
2. Paste `https://github.com/Caged1994/SillyTavern-FFVIII-Garden.git`.
3. Confirm, then reload the page.
4. Open a chat, select your Persona, and press **Load test kit** to try the menus.

For updates, use the update control in **Manage Extensions**, then refresh with **Ctrl+F5**. You do not need to reinstall or reset your chat data.

## Manual installation on Windows

1. Close SillyTavern and extract the extension files into a folder named `ff8-garden`.
2. Open your SillyTavern installation folder, which contains `Start.bat` and `public`.
3. Place `ff8-garden` in `public\scripts\extensions\third-party`. Create `third-party` if needed.
4. The final path must be `SillyTavern\public\scripts\extensions\third-party\ff8-garden\manifest.json`, without a second nested extension folder.
5. Restart SillyTavern and refresh with **Ctrl+F5**.
6. Under **Extensions → FFVIII • Garden**, enable **Enable Garden layout**. Check Manage Extensions if the extension does not appear.
7. Open a chat and select a Persona.

This is a frontend extension. No server plugin, Extras server, new API key, or dependency installation is required. Manual installation under `public` makes it available to all users of that installation.

## First test

1. Open a test chat and select your protagonist's Persona.
2. Press **Load test kit**. This adds Shiva, Quezacotl, 80 units each of Fire, Blizzard, Thunder, and Cure, and at least 5 Potions. The kit is an explicit testing feature, not a narrative reward.
3. In **Junction**, select **Strength**, choose **Fire**, and press **Apply Junction**. Strength increases from 10 to 18.
4. Junction **Cure** to **HP**: maximum HP increases from 500 to 980. Current HP is not automatically healed.
5. In **Guardian Force**, select **Vitality-J** as Shiva's learning target. Award 100 AP to unlock the Vitality Junction.
6. Switch Persona. Its name, portrait, and resources are separate. Return to the first Persona to restore its displayed state.
7. Reload the page. Changes are saved in the chat metadata.

## Narration and original GFs

When **Share state and protocol with the AI** is enabled, Garden adds the current state and event instructions to your normal generation request. Your existing model and connection are used; no additional API request is made.

The AI narrates and can emit `garden-event` blocks. Garden validates quantities, resources, and abilities. Original GFs can have custom names, descriptions, and elements, but their abilities come from a fixed catalog. An encounter does not grant ownership. Even after acquisition, equipping GFs and choosing Junctions remain the user's decisions.

Example compatible response:

````text
Vesper, a silver moth-like GF, descends from the library ceiling. For now, it simply watches you.

```garden-event
{"id":"vesper-encounter-001","type":"gf_discover","gf":"vesper","name":"Vesper","description":"A silver moth that guards dreams.","element":"Non-elemental","abilities":["j_hp","j_mag","j_spr","mag20","magic","draw","item","summon"]}
```
````

Later acquisition:

````text
```garden-event
{"id":"vesper-pact-002","type":"gf_acquire","gf":"vesper"}
```
````

Also supported: `magic`, `item`, `gil`, `hp`, and `ap` events. Unique event IDs prevent duplicate application. Invalid events are rejected with a message. A batch is only applied if every new event is valid.

**Apply AI events after each response** is enabled initially. Disable it if you prefer to inspect a response and press **Read latest response events** yourself. Event blocks appear in collapsible **Garden events** sections when the Garden layout is active. The original message text is preserved. If your model ignores the protocol, you can still update resources and register GFs through the menus.

## Implemented rules

- Magic stock: 0–100 per spell. Each spell can be junctioned to one stat.
- Junctions require a learned ability from an acquired, equipped GF.
- One learning target per GF. AP goes to every equipped GF with a selected target. Excess AP does not carry over to another ability.
- Up to 3 commands in addition to Attack and 2 passive abilities. HP, Strength, Magic, and Vitality +20% bonuses are supported.
- Potions, Hi-Potions, and Phoenix Downs have deterministic consumption and healing effects.
- JSON import/export for the current chat and Persona. Undo the last 12 operations, including AI event batches.
- Initially empty resources, configurable base stats, and level 1–100.

These are **simplified FFVIII-inspired rules**, not an exact recreation of the original game. The Junction formula is `base + floor(magic bonus at 100 units × stock / 100)`, followed by passive bonuses. Caps: 9999 HP and 255 for other stats. Consuming magic reduces its bonus; reaching zero stock clears that Junction. Unequipping a GF clears Junctions that are no longer supported. Awarding EXP increases level every 1000 points and grants +30 base HP and +1 Strength, Vitality, Magic and Spirit per level, up to level 100. Directly editing the level does not grant growth. GF AP is independent of character EXP.

## Campaign menus

Campaign features are inspired by [Better-Stats](https://github.com/Caged1994/Better-Stats) and independently implemented for Garden.

- **Character selector / Party:** each companion has a separate sheet, stocks, Junctions, GFs, equipment, conditions and EXP. Scene presence is separate from party membership. The protagonist always comes from the active Persona.
- **Missions:** main/side missions with progress and fixed EXP/Gil/AP rewards. Completion grants rewards once. EXP goes to every party member; Gil and GF AP go to the protagonist. Completed missions cannot be rewritten by the AI.
- **Status:** award EXP and manage Poison, Sleep, Silence, Protect, Shell and Haste with explicit turn counts. Advance turns manually or through a validated `tick` event. Poison removes floor(maximum HP / 16), at least 1 HP, per tick; Haste doubles effective Speed. Other conditions are shared with the narrator; damage reduction and action blocking are not a combat simulator.
- **Inventory:** backpack weapons, armor, materials and key items with quantities. Equip weapons/armor manually; bonuses affect effective stats without changing base stats. The UI supports Strength/Magic bonuses; the event/import schema accepts any supported stat. There are no weapon-upgrade recipes yet.
- **Scene & memories:** location, time, day, present characters and current mission. Important NPC memories and memories for present NPCs are included in the AI prompt, up to 20 entries. Use stable IDs to edit existing records.
- **Extensions → AI permissions:** independently allow HP, resources, GFs, progression, missions, conditions, equipment registration, memories, scene and party updates. Disallowed AI events reject the entire batch. Junctions, GF assignment and equipment loadout always stay manual.

Additional event payloads (each also needs a unique `id` and `type`):

| Type | Fields |
| --- | --- |
| `party` | `member`, `name` |
| `xp` | `amount`, optional `target` |
| `condition` | `condition`, `turns` (0 removes), optional `target` |
| `tick` | `turns`, optional `target` |
| `equipment` | `gear`, `name`, `kind` (`weapon`, `armor`, `material`, `key`), `quantity`, `bonuses` |
| `quest` | `quest`, `title`, `kind`, `progress`, `reward: {xp,gil,ap}` |
| `quest_complete` | `quest` |
| `memory` | `memory`, `npc`, `text`, `important` |
| `scene` | `location`, `time`, `day`, `present: [names]`, `mission` |

Existing resource/GF events also accept `target`: `protagonist` or a companion ID. Backpack equipment events replace the item's quantity and bonuses; they are not quantity deltas. The AI cannot equip it. Existing saves and imports acquire empty campaign fields automatically. Export includes the entire party and campaign for the active chat/Persona.

## Current limits

There is no combat engine, ATB, enemy system, calculated battle damage, Limit Breaks, animations, elemental/status Junctions, Triple Triad, refinement, or complete game catalog yet. AI HP events represent narrative consequences rather than a simulated combat result.

The layout targets desktop screens at least 1366 pixels wide. The left panel hides below 1050 pixels. Full mobile support is not included. Garden uses your Persona portrait and current SillyTavern background, with interactive panels inspired by the initial mockup; FFVIII artwork is not bundled.

Garden stores response snapshots for the last **40 applied AI batches**, separately for each chat and Persona. Swiping, editing, regenerating or deleting tracked responses reverses their changes and replays affected subsequent responses. Fields changed manually after the response are retained when they conflict with the snapshot; inspect the result when editing the same resource manually. Invalid Junctions are still cleared if their supporting stock or GF disappears. Older batches and events applied before upgrading to 0.2.0 cannot be restored automatically. Manual Undo covers the last 12 operations; an automatic response restoration resets that manual undo history. Changes outside Garden do not automatically update its state. Deleting a chat deletes its associated save data; export first if you want to keep it.

Legacy Italian element values are accepted on import and in old event payloads, then displayed in English. Built-in GF descriptions and known extension-generated historical log labels are translated on display/export. Custom content is preserved.

## Disable or remove

Press **Close** in the top bar to restore the original layout. Re-enable Garden in Extensions to reopen it. The AI bridge can be disabled separately. To remove a manual installation, close SillyTavern, remove only the extension folder under `public\scripts\extensions\third-party`, and restart. Chat metadata is retained.

## Validation and references

The integration was checked against SillyTavern 1.19.0 source commit `06bde939f`. APIs: `SillyTavern.getContext()`, `chatMetadata`, `saveMetadata()`, `extensionSettings`, `setExtensionPrompt()`, and chat/Persona/generation events. Persona identity and portrait use `scripts/personas.js`; if unavailable, the fallback uses the display name and cannot distinguish two Personas with the same name.

- Official extension documentation: https://docs.sillytavern.app/for-contributors/writing-extensions/
- SillyTavern source: https://github.com/SillyTavern/SillyTavern/tree/06bde939f

Run `npm test` with Node; engine tests require no dependencies. For the menu integration suite, run `npm ci` followed by `npm run test:ui` (jsdom is a development dependency only; installation in SillyTavern needs no npm packages). Engine tests and menu interactions with simulated SillyTavern APIs cover Junctions, AP, Persona separation, persistence, events, duplicates, undo, migration, party resources, mission rewards, conditions, equipment, permissions, response restoration and disabling. Full browser visual verification was unavailable in the development environment. Compatibility with your installed themes, extensions, and online model still requires a real installation test.

Unofficial fan project. Original code is licensed under MIT. Final Fantasy and related names belong to their respective rights holders.
