<template lang="pug">
v-dialog(v-model='isShown', persistent, max-width='700', no-click-animation)
  v-btn(fab, fixed, bottom, right, color='grey darken-3', dark, @click='goBack', style='width: 50px;'): v-icon mdi-undo-variant
  v-card.radius-7(color='blue darken-3', dark)
    v-card-text.text-center.py-4
      .subtitle-1.white--text {{$t('editor:select.title')}}
      v-container(grid-list-lg, fluid)
        v-layout(row, wrap, justify-center)
          // Markdown — caché si restreint
          v-flex(xs6 v-if='isAllowed("markdown")')
            v-card.radius-7.animated.fadeInUp.wait-p1s(hover light ripple)
              v-card-text.text-center(@click='selectEditor("markdown")')
                img(src='/_assets/svg/editor-icon-markdown.svg', alt='Markdown', style='width: 36px;')
                .body-2.primary--text.mt-2 Markdown
                .caption.grey--text Plain Text Formatting

          // Visual Editor — toujours autorisé si restreint
          v-flex(xs6 v-if='isAllowed("ckeditor")')
            v-card.radius-7.animated.fadeInUp.wait-p2s(hover light ripple)
              v-card-text.text-center(@click='selectEditor("ckeditor")')
                img(src='/_assets/svg/editor-icon-ckeditor.svg', alt='Visual Editor', style='width: 36px;')
                .body-2.mt-2.primary--text Visual Editor
                .caption.grey--text Rich-text WYSIWYG

          // AsciiDoc — caché si restreint
          v-flex(xs4 v-if='isAllowed("asciidoc")')
            v-card.radius-7.animated.fadeInUp.wait-p3s(hover light ripple)
              v-card-text.text-center(@click='selectEditor("asciidoc")')
                img(src='/_assets/svg/editor-icon-asciidoc.svg', alt='AsciiDoc', style='width: 36px;')
                .body-2.primary--text.mt-2 AsciiDoc
                .caption.grey--text Plain Text Formatting

          // Code (HTML brut) — caché si restreint
          v-flex(xs4 v-if='isAllowed("code")')
            v-card.radius-7.animated.fadeInUp.wait-p4s(hover light ripple)
              v-card-text.text-center(@click='selectEditor("code")')
                img(src='/_assets/svg/editor-icon-code.svg', alt='Code', style='width: 36px;')
                .body-2.primary--text.mt-2 Code
                .caption.grey--text Raw HTML

          // From Template — toujours autorisé si restreint
          v-flex(xs4 v-if='isAllowed("template")')
            v-card.radius-7.animated.fadeInUp.wait-p5s(hover light ripple)
              v-card-text.text-center(@click='fromTemplate')
                img(src='/_assets/svg/icon-cube.svg', alt='From Template', style='width: 42px; opacity: .5;')
                .body-2.mt-1.teal--text From Template
                .caption.grey--text Use an existing page...

    page-selector(mode='select', v-model='templateDialogIsShown', :open-handler='fromTemplateHandle', :path='path', :locale='locale', must-exist)
</template>

<script>
import _ from "lodash";
import { sync, get } from "vuex-pathify";

// Jeux d'éditeurs autorisés
const FULL_ALLOWED = new Set([
  "markdown",
  "ckeditor",
  "asciidoc",
  "code",
  "template"
]);
const LIMITED_ALLOWED = new Set(["ckeditor", "template"]);

export default {
  props: { value: { type: Boolean, default: false } },
  data() {
    return { templateDialogIsShown: false };
  },
  computed: {
    isShown: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("input", v);
      }
    },
    currentEditor: sync("editor/editor"),
    locale: get("page/locale"),
    path: get("page/path"),

    // -- Récupère l'utilisateur depuis le store (adapte si besoin)
    user() {
      // Essaie plusieurs branches possibles selon la version
      const s = this.$store.state || {};
      const u =
        s.session?.user ||
        s.user ||
        s.auth?.user ||
        s.account?.profile ||
        this.$root?.user || // au cas où l'app l'expose à la racine
        this.user || // si déjà injecté par parent
        {};
      return u;
    },

    // Administrateur = possède la permission "manage:system"
    isSystemManager() {
      const perms = this.user?.permissions || [];
      return Array.isArray(perms) && perms.includes("manage:system");
    },

    // Ensemble d'éditeurs autorisés selon la permission
    allowedEditors() {
      return this.isSystemManager ? FULL_ALLOWED : LIMITED_ALLOWED;
    }
  },

  methods: {
    isAllowed(name) {
      return this.allowedEditors.has(name);
    },
    selectEditor(name) {
      if (!this.isAllowed(name)) {
        this.$toast?.error?.(
          this.$t?.("common:forbidden") || "Action non autorisée"
        );
        return;
      }
      this.currentEditor = `editor${_.startCase(name)}`;
      this.isShown = false;
    },
    goBack() {
      window.history.go(-1);
    },
    fromTemplate() {
      if (!this.isAllowed("template")) {
        this.$toast?.error?.(
          this.$t?.("common:forbidden") || "Action non autorisée"
        );
        return;
      }
      this.templateDialogIsShown = true;
    },
    fromTemplateHandle({ id }) {
      this.templateDialogIsShown = false;
      this.isShown = false;
      this.$nextTick(() => {
        window.location.assign(`/e/${this.locale}/${this.path}?from=${id}`);
      });
    }
  },

  mounted() {}
};
</script>

<style lang="scss"></style>
