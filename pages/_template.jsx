import React from 'react'
import { Link } from 'react-router'
import { Container } from 'react-responsive-grid'
import { prefixLink } from 'gatsby-helpers'
import includes from 'underscore.string/include'
import { colors, activeColors, headerColors } from 'utils/colors'

import typography from 'utils/typography'
import { config } from 'config'

// Import styles.
import 'css/main.css'
import 'css/github.css'

const { rhythm, adjustFontSizeTo } = typography

module.exports = React.createClass({
  propTypes () {
    return {
      children: React.PropTypes.object,
    }
  },
  render () {
    const docsActive = includes(this.props.location.pathname, 'docs')
    const examplesActive = includes(this.props.location.pathname, 'examples')

    return (
      <div>
        <div
          style={{
            background: headerColors.bg,
            color: headerColors.fg
          }}
        >
          <Container
            style={{
              maxWidth: 960,
              paddingLeft: rhythm(3/4),
              paddingTop: '10px',
              paddingBottom: '10px',
              display: 'flex',
              borderBottomWidth: '2px',
              borderBottomColor: config.baseColor,
              borderBottomStyle: 'solid'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Link
                to={prefixLink('/')}
                style={{
                  textDecoration: 'none',
                  color: colors.fg
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    verticalAlign: 'baseline'
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      verticalAlign: 'middle',
                      paddingLeft: rhythm(1/2),
                      paddingRight: rhythm(1/2)
                    }}
                  >
                    <img src={prefixLink('/mali-logo.png')} style={{
                      verticalAlign: 'middle',
                      marginBottom: '0px'
                    }} />
                  </div>
                  <div
                    style={{
                      fontSize: adjustFontSizeTo('36px').fontSize,
                      fontWeight: 'bold',
                      verticalAlign: 'middle',
                      paddingLeft: rhythm(1/2),
                      paddingRight: rhythm(1/2)
                    }}
                  >
                    {config.siteTitle.toUpperCase()}
                  </div>
                </div>
              </Link>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                verticalAlign: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <Link
                to={prefixLink('/docs/')}
                style={{
                  background: docsActive ? headerColors.bg : headerColors.bg,
                  color: docsActive ? headerColors.activeFg : headerColors.fg,
                  float: 'right',
                  textDecoration: 'none',
                  paddingLeft: rhythm(1/2),
                  paddingRight: rhythm(1/2),
                  paddingBottom: rhythm(3/4),
                  paddingTop: rhythm(3/4)
                }}
              >
                Documentation
              </Link>
              <Link
                to={prefixLink('/examples/')}
                style={{
                  background: examplesActive ? headerColors.bg : headerColors.bg,
                  color: examplesActive ? headerColors.activeFg : headerColors.fg,
                  float: 'right',
                  textDecoration: 'none',
                  paddingLeft: rhythm(1/2),
                  paddingRight: rhythm(1/2),
                  paddingBottom: rhythm(3/4),
                  paddingTop: rhythm(3/4)
                }}
              >
                Examples
              </Link>
              <a
                style={{
                  float: 'right',
                  color: colors.fg,
                  textDecoration: 'none',
                  textDecoration: 'none',
                  paddingLeft: rhythm(1/2),
                  paddingRight: rhythm(1/2),
                  paddingBottom: rhythm(3/4),
                  paddingTop: rhythm(3/4)
                }}
                href="https://github.com/malijs/mali"
              >
                Github
              </a>
            </div>
          </Container>
        </div>
        <Container
          style={{
            maxWidth: 960,
            padding: `${rhythm(1)} ${rhythm(3/4)}`,
            paddingTop: rhythm(1)
          }}
        >
          {this.props.children}
        </Container>
      </div>
    )
  },
})
