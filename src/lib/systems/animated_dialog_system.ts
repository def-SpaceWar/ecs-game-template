import { AnimatedDialog } from "../components/animated_dialog";
import { ParagraphRenderer } from "../components/paragraph_renderer";
import { TextRenderer } from "../components/text_renderer";
import { World } from "../ecs";
import { Time } from "../util/time";

export function animatedDialogSystem(world: World) {
    for (const animatedDialog of world.findComponents(AnimatedDialog)) {
        if (animatedDialog.isDone) continue;
        animatedDialog.partOfCharacter += Time.renderDeltaTime * animatedDialog.speed;

        if (animatedDialog.multiLine) {
            var paragraph = world.getComponent(
                animatedDialog.entity,
                ParagraphRenderer
            );
        } else {
            var text = world.getComponent(animatedDialog.entity, TextRenderer);
        }

        if (!paragraph && !text) throw new Error("Missing text renderer on AnimatedDialog!");

        while (animatedDialog.partOfCharacter > 1) {
            animatedDialog.partOfCharacter -= 1;
            animatedDialog.currentCharacter += 1;

            if (animatedDialog.currentCharacter >= animatedDialog.dialog[animatedDialog.currentLine].length) {
                animatedDialog.currentLine++;
                if (text) text.text += " ";
                animatedDialog.currentCharacter = 0;
                if (animatedDialog.dialog.length <= animatedDialog.currentLine) {
                    animatedDialog.isDone = true;
                    break;
                }
            }

            if (paragraph) {
                if (!paragraph.text[animatedDialog.currentLine]) paragraph.text[animatedDialog.currentLine] = "";
                paragraph.text[animatedDialog.currentLine] += animatedDialog.dialog[animatedDialog.currentLine][animatedDialog.currentCharacter];
            } else if (text) {
                text.text += animatedDialog.dialog[animatedDialog.currentLine][animatedDialog.currentCharacter];
            }
        }
    }
}