<template>
  <v-footer class="footer-wikilia justify-center" :color="bgColor" inset>
    <v-container class="py-10">
      <v-row class="align-start">
        <!-- Bloc marque -->
        <v-col cols="12" md="4" class="mb-8">
          <div class="brand">
            <div class="brand-title">Wikilia</div>
            <div class="brand-subtitle">Des ressources collaboratives</div>
          </div>
        </v-col>

        <!-- Menu -->
        <v-col cols="12" sm="4" md="2" class="mb-8">
          <h4 class="col-title">Menu</h4>
          <ul class="links">
            <li><a href="/">Accueil</a></li>
            <li><a href="/a-propos">À propos</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </v-col>

        <!-- Contact -->
        <v-col cols="12" sm="4" md="3" class="mb-8">
          <h4 class="col-title">Contact</h4>
          <ul class="links">
            <li>
              <a
                href="https://projetmassilia.com"
                target="_blank"
                rel="noopener"
                >Projet Massilia</a
              >
            </li>
            <li>
              <a
                href="https://www.instagram.com/projetmassilia?igsh=MWRuZzBwamlycWV3aA=="
                target="_blank"
                rel="noopener"
                >Instagram</a
              >
            </li>
            <li>
              <a
                href="https://www.facebook.com/people/Massilia/61558533511868/?_rdr"
                target="_blank"
                rel="noopener"
                >Facebook</a
              >
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/projet-massilia/"
                target="_blank"
                rel="noopener"
                >LinkedIn</a
              >
            </li>
          </ul>
        </v-col>

        <!-- Mentions légales -->
        <v-col cols="12" sm="4" md="3">
          <h4 class="col-title">Mentions légales</h4>
          <ul class="links">
            <li><a href="/confidentialite">Confidentialité</a></li>
            <li><a href="/conditions">Conditions d'utilisations</a></li>
          </ul>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
import { get } from "vuex-pathify";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: true
});

export default {
  props: {
    color: {
      type: String,
      default: "grey lighten-3"
    },
    darkColor: {
      type: String,
      default: "grey darken-3"
    }
  },
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  },
  computed: {
    company: get("site/company"),
    contentLicense: get("site/contentLicense"),
    footerOverride: get("site/footerOverride"),
    footerOverrideRender() {
      if (!this.footerOverride) {
        return "";
      }
      return md.renderInline(this.footerOverride);
    },
    bgColor() {
      if (!this.$vuetify.theme.dark) {
        return this.color;
      } else {
        return this.darkColor;
      }
    }
  }
};
</script>

<style lang="scss">
.footer-wikilia {
  background: #e9e5e4; /* fond très clair, proche de ta capture */
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  .brand-title {
    font-size: 56px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: 0.4px;
    color: #295b4b; /* vert profond */
    margin-bottom: 8px;
  }
  .brand-subtitle {
    font-size: 22px;
    color: #1f1f1f;
    opacity: 0.9;
  }

  .col-title {
    font-size: 24px;
    font-weight: 700;
    color: #c9a8a1; /* rose/mauve doux des titres */
    margin-bottom: 16px;
  }

  .links {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin: 12px 0;
    }
    a {
      color: #6f3f39; /* brun des liens */
      text-decoration: underline;
      text-underline-offset: 3px;
      &:hover {
        text-decoration-thickness: 2px;
      }
    }
  }
}

/* Option : ajustements en mode sombre Vuetify */
.theme--dark .footer-wikilia {
  background: #2b2b2b;
  .brand-subtitle {
    color: #ddd;
    opacity: 0.9;
  }
  .col-title {
    color: #d6b8b2;
  }
  .links a {
    color: #d2a39b;
  }
}
</style>
