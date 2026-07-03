import type { CoverageAreaData, CoverageAreaFormState } from '@/types/coverageArea'
import { readString, resolveImageUrl } from '@/utils/cms'

export function mapCoverageAreaToFormState(
  data: CoverageAreaData | null | undefined,
): CoverageAreaFormState {
  return {
    heroTitle: readString(data?.hero?.title),
    heroCounties: readString(data?.hero?.counties),
    heroDescription: readString(data?.hero?.description),
    dfwTitle: readString(data?.sections?.dfw?.title),
    houstonTitle: readString(data?.sections?.houston?.title),
    sanAntonioTitle: readString(data?.sections?.sanAntonio?.title),
    quickResponseTitle: readString(data?.quickResponse?.title),
    quickResponseDescription: readString(data?.quickResponse?.description),
    scheduleButton: readString(data?.quickResponse?.scheduleButton),
    callButton: readString(data?.quickResponse?.callButton),
    phoneNumber: readString(data?.quickResponse?.phoneNumber),
    mapImageUrl: resolveImageUrl(data?.map?.image),
    mapAlt: readString(data?.map?.alt),
    overlayTitle: readString(data?.map?.overlay?.title),
    overlaySubtitle: readString(data?.map?.overlay?.subtitle),
    overlayButtonText: readString(data?.map?.overlay?.buttonText),
  }
}

export function mapFormStateToCoverageArea(
  form: CoverageAreaFormState,
  existing: CoverageAreaData | null | undefined,
  uploadedMapImage?: string,
): CoverageAreaData {
  const existingMap = existing?.map ?? {}
  const existingOverlay = existingMap.overlay ?? {}

  return {
    hero: {
      ...existing?.hero,
      title: form.heroTitle,
      counties: form.heroCounties,
      description: form.heroDescription,
    },
    sections: {
      dfw: { title: form.dfwTitle },
      houston: { title: form.houstonTitle },
      sanAntonio: { title: form.sanAntonioTitle },
    },
    quickResponse: {
      ...existing?.quickResponse,
      title: form.quickResponseTitle,
      description: form.quickResponseDescription,
      scheduleButton: form.scheduleButton,
      callButton: form.callButton,
      phoneNumber: form.phoneNumber,
    },
    map: {
      ...existingMap,
      alt: form.mapAlt,
      ...(uploadedMapImage !== undefined ? { image: uploadedMapImage } : {}),
      overlay: {
        ...existingOverlay,
        title: form.overlayTitle,
        subtitle: form.overlaySubtitle,
        buttonText: form.overlayButtonText,
      },
    },
  }
}
