<template>
  <BaseCard
    :item="project"
    icon="translate"
    :title="project.attributes?.name || project.name"
    :subtitle="projectSubtitle"
    :status="formattedStatus"
    :status-key="project.attributes?.status"
    :metadata="projectMetadata"
    variant="secondary"
    data-testid="project-card"
    :style="cardStyle"
    @click="$emit('open', project)"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { BaseCard } from '@/components/base/index.js';
import { formatDate } from '@/utils/dateUtils.js';
import { formatProjectPrice } from '@/utils/formatters.js';
import { useStatusFormatter } from '@/composables/useStatusFormatter.js';
import { useLanguage } from '@/composables/ui/useLanguage.js';

const { t } = useI18n();
const { formatStatus } = useStatusFormatter();
const { locale } = useLanguage();

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const cardTitle = computed(() => props.project.attributes?.name || props.project.name || '');

const cardStyle = computed(() => {
  const len = cardTitle.value.length;
  /* 
  Can be abstracted if more card types need dynamic sizing, 
  controlled via props, or set from config 
  */
  if (len <= 18) {
    // Compact cards for very short titles
    return { width: 'clamp(260px, 34%, 380px)' };
  }
  if (len <= 28) {
    // Slightly narrower than default for medium titles
    return { width: 'clamp(300px, 40%, 440px)' };
  }
  // Use BaseCard defaults for longer titles
  return {};
});

const projectSubtitle = computed(() => {
  const attrs = props.project.attributes;
  if (!attrs) return 'Translation project';

  const sourceLanguage = attrs.source_language?.toUpperCase() || t('project.unknownLanguage');
  const targets = Array.isArray(attrs.target_languages)
    ? attrs.target_languages.map((l) => l.toUpperCase()).join(', ')
    : '';
  return `${sourceLanguage} → ${targets || t('project.unknownLanguage')}`;
});

const formattedStatus = computed(() => {
  return formatStatus(props.project.attributes?.status);
});

const projectMetadata = computed(() => {
  const attrs = props.project.attributes;
  const metadata = [
    {
      label: t('metadata.created'),
      value: formatDate(attrs?.created_at),
    },
    {
      label: t('metadata.updated'),
      value: formatDate(attrs?.updated_at),
    },
  ];

  const price = attrs?.price;
  const payment = attrs?.payment;

  // Language-dependent price display
  if (locale.value === 'da') {
    // Danish: DKK main, EUR in parentheses
    if (price?.total && price?.currency === 'DKK') {
      let euro = '';
      if (price.amount_euro) {
        euro = ` (${formatProjectPrice({ amount_euro: price.amount_euro })})`;
      }
      metadata.push({
        label: t('metadata.price'),
        value: `DKK ${(price.total / 100).toFixed(2)}${euro}`,
      });
    }
    if (payment && payment.gross_amount && payment.currency === 'DKK') {
      let euro = '';
      if (price?.amount_euro) {
        euro = ` (${formatProjectPrice({ amount_euro: price.amount_euro })})`;
      }
      metadata.push({
        label: t('metadata.payment'),
        value: `DKK ${(payment.gross_amount / 100).toFixed(2)}${euro}`,
      });
    }
  } else {
    // English: EUR main, DKK in parentheses
    if (price?.amount_euro) {
      let dkk = '';
      if (price?.total && price?.currency === 'DKK') {
        dkk = ` (DKK ${(price.total / 100).toFixed(2)})`;
      }
      metadata.push({
        label: t('metadata.price'),
        value: `${formatProjectPrice({ amount_euro: price.amount_euro })}${dkk}`,
      });
    }
    if (payment && payment.gross_amount && payment.currency === 'DKK') {
      let dkk = '';
      if (price?.total && price?.currency === 'DKK') {
        dkk = ` (DKK ${(payment.gross_amount / 100).toFixed(2)})`;
      }
      metadata.push({
        label: t('metadata.payment'),
        value: `${formatProjectPrice({ amount_euro: price.amount_euro })}${dkk}`,
      });
    }
  }

  return metadata;
});

defineEmits(['open']);
</script>
