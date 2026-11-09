import { ArrowUpRight, Boxes, CircuitBoard, Network } from "lucide-react";
import { t, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";

export function ProjectsContent({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <main id="main-content" className="interior-page site-container">
      <header className="page-heading">
        <h1>{labels.projects.heading}</h1>
        <p>{labels.projects.intro}</p>
      </header>
      <section className="project-index" aria-label={labels.projects.heading}>
        <article className="project-index-row" id="xr-embodied-ai">
          <div className="project-index-icon"><Boxes aria-hidden="true" /></div>
          <div>
            <span className="project-status">{labels.projects.xrStatus}</span>
            <h2>XR × Embodied AI</h2>
            <p>{labels.projects.xrDescription}</p>
            <span className="project-keywords">XR · Embodied AI · Interaction</span>
          </div>
        </article>
        <article className="project-index-row" id="openrdma">
          <div className="project-index-icon"><Network aria-hidden="true" /></div>
          <div>
            <span className="project-status">{labels.projects.rdmaStatus}</span>
            <h2>
              <a href={siteConfig.openRdmaRepo} target="_blank" rel="noopener noreferrer">
                OpenRDMA <ArrowUpRight aria-hidden="true" />
              </a>
            </h2>
            <p>{labels.projects.rdmaDescription}</p>
            <span className="project-keywords">RDMA · FPGA · Networking</span>
            <div className="project-actions">
              <a href={siteConfig.openRdmaRepo} target="_blank" rel="noopener noreferrer">
                {labels.projects.repository} <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={siteConfig.paper} target="_blank" rel="noopener noreferrer">
                {labels.projects.paper} <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
        <article className="project-index-row" id="graphicalhdl">
          <div className="project-index-icon"><CircuitBoard aria-hidden="true" /></div>
          <div>
            <span className="project-status">{labels.projects.graphicalStatus}</span>
            <h2>GraphicalHDL</h2>
            <p>{labels.projects.graphicalDescription}</p>
            <span className="project-keywords">TypeScript · SystemVerilog · RTL</span>
            <div className="project-actions">
              <a href={siteConfig.graphicalHdl} target="_blank" rel="noopener noreferrer">
                {labels.projects.source} <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
